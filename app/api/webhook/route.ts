import { NextResponse } from "next/server"
import Stripe from "stripe"
import { executeQuery, executeQuerySingle } from "@/lib/database"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // Versión más reciente
})

// Función para leer el cuerpo de la solicitud como texto sin procesar
async function getRawBody(request: Request): Promise<string> {
  const reader = request.body?.getReader()
  if (!reader) return ""

  const chunks: Uint8Array[] = []
  let done = false

  while (!done) {
    const { done: doneReading, value } = await reader.read()
    done = doneReading
    if (value) chunks.push(value)
  }

  const concatenated = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
  let position = 0
  for (const chunk of chunks) {
    concatenated.set(chunk, position)
    position += chunk.length
  }

  return new TextDecoder().decode(concatenated)
}

export async function POST(request: Request) {
  try {
    const rawBody = await getRawBody(request)
    const signature = request.headers.get("stripe-signature") as string

    if (!signature) {
      return NextResponse.json({ error: "No Stripe signature found" }, { status: 400 })
    }

    // Verificar el evento con la firma de Stripe
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    console.log(`Evento de Stripe recibido: ${event.type}`)

    // Manejar el evento según su tipo
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        // Actualizar el estado del pedido a 'processing' y el payment_status a 'paid'
        if (session.metadata?.order_id) {
          const updateOrderQuery = `
            UPDATE orders 
            SET status = 'processing', 
                payment_status = 'paid', 
                updated_at = NOW(), 
                payment_intent_id = ?
            WHERE id = ?
          `
          await executeQuery(updateOrderQuery, [session.payment_intent as string, session.metadata.order_id])
          console.log(`Pedido ${session.metadata.order_id} actualizado a processing y paid`)

          // Obtener los items del pedido y actualizar el stock
          const getOrderItemsQuery = `
            SELECT product_id, quantity FROM order_items WHERE order_id = ?
          `
          const orderItems = (await executeQuery(getOrderItemsQuery, [session.metadata.order_id])) as any[]

          for (const item of orderItems) {
            const updateStockQuery = `
              UPDATE products 
              SET stock_quantity = stock_quantity - ? 
              WHERE id = ?
            `
            await executeQuery(updateStockQuery, [item.quantity, item.product_id])
            console.log(`Stock actualizado para producto ${item.product_id}: -${item.quantity} unidades`)
          }
        }
        break
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Buscar el pedido por payment_intent_id y actualizar su estado
        const findOrderQuery = `
          SELECT id FROM orders WHERE payment_intent_id = ?
        `
        const order = await executeQuerySingle(findOrderQuery, [paymentIntent.id])

        if (order) {
          const updateOrderQuery = `
            UPDATE orders 
            SET payment_status = 'confirmed', 
                updated_at = NOW() 
            WHERE id = ?
          `
          await executeQuery(updateOrderQuery, [(order as any).id])
          console.log(`Pago confirmado para pedido ${(order as any).id}`)
        }
        break
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Buscar el pedido por payment_intent_id y actualizar su estado
        const findOrderQuery = `
          SELECT id FROM orders WHERE payment_intent_id = ?
        `
        const order = await executeQuerySingle(findOrderQuery, [paymentIntent.id])

        if (order) {
          const updateOrderQuery = `
            UPDATE orders 
            SET status = 'cancelled', 
                payment_status = 'failed', 
                updated_at = NOW() 
            WHERE id = ?
          `
          await executeQuery(updateOrderQuery, [(order as any).id])
          console.log(`Pago fallido para pedido ${(order as any).id}`)
        }
        break
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge

        if (charge.payment_intent) {
          // Buscar el pedido por payment_intent_id
          const findOrderQuery = `
            SELECT id FROM orders WHERE payment_intent_id = ?
          `
          const order = await executeQuerySingle(findOrderQuery, [charge.payment_intent as string])

          if (order) {
            // Actualizar el estado del pago a 'refunded'
            const updateOrderQuery = `
              UPDATE orders 
              SET payment_status = 'refunded', 
                  updated_at = NOW() 
              WHERE id = ?
            `
            await executeQuery(updateOrderQuery, [(order as any).id])
            console.log(`Reembolso procesado para pedido ${(order as any).id}`)
          }
        }
        break
      }
      // Puedes añadir más casos según necesites
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Error al procesar el webhook:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
