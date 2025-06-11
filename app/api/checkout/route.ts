import { NextResponse } from "next/server"
import Stripe from "stripe"
import type { CartItem } from "@/lib/cart-context"
import { executeQuery } from "@/lib/database"

// Inicializar Stripe con la versión más reciente
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil", // Versión más reciente
})

export async function POST(request: Request) {
  try {
    const { items, customerInfo } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart" }, { status: 400 })
    }

    // Obtener la URL base de forma segura
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // Asegurar que la URL tenga el protocolo correcto
    const getFullUrl = (path: string) => {
      if (baseUrl.startsWith("http://") || baseUrl.startsWith("https://")) {
        return `${baseUrl}${path}`
      } else {
        // Si no tiene protocolo, añadir https:// por defecto (o http:// para localhost)
        const protocol = baseUrl.includes("localhost") ? "http://" : "https://"
        return `${protocol}${baseUrl}${path}`
      }
    }

    // Crear los line items para Stripe
    const lineItems = items.map((item: CartItem) => {
      // Manejar la imagen del producto de forma segura
      let productImages: string[] = []

      if (item.image && item.image.startsWith("http")) {
        // Si la imagen ya es una URL completa, usarla
        productImages = [item.image]
      } else if (item.image && !item.image.includes("placeholder")) {
        // Si es una imagen real del producto, crear la URL completa
        productImages = [getFullUrl(item.image)]
      }
      // Si no hay imagen o es placeholder, no enviar imágenes a Stripe (es opcional)

      const lineItem: any = {
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            description: item.description ? item.description.substring(0, 255) : item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100), // Stripe usa centavos
        },
        quantity: item.quantity,
      }

      // Solo añadir imágenes si tenemos URLs válidas
      if (productImages.length > 0) {
        lineItem.price_data.product_data.images = productImages
      }

      return lineItem
    })

    // Añadir gastos de envío
    lineItems.push({
      price_data: {
        currency: "eur",
        product_data: {
          name: "Gastos de envío",
          description: "Envío estándar",
        },
        unit_amount: 499, // 4.99€
      },
      quantity: 1,
    })

    // Calcular el total
    const subtotal = items.reduce((sum: number, item: CartItem) => sum + Number(item.price) * item.quantity, 0)
    const total = subtotal + 4.99

    // Crear un registro de pedido en la base de datos
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`

    const insertOrderQuery = `
      INSERT INTO orders (
        order_number, customer_email, customer_first_name, customer_last_name,
        shipping_address, shipping_city, shipping_postal_code,
        subtotal, shipping_cost, total, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    `

    const orderResult = (await executeQuery(insertOrderQuery, [
      orderNumber,
      customerInfo.email,
      customerInfo.firstName,
      customerInfo.lastName,
      customerInfo.address,
      customerInfo.city,
      customerInfo.postalCode,
      subtotal,
      4.99,
      total,
    ])) as any

    const orderId = orderResult.insertId

    // Guardar los items del pedido
    for (const item of items) {
      const insertItemQuery = `
        INSERT INTO order_items (
          order_id, product_id, product_name, product_price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)
      `

      await executeQuery(insertItemQuery, [
        orderId,
        item.id,
        item.name,
        Number(item.price),
        item.quantity,
        Number(item.price) * item.quantity,
      ])
    }

    // URLs para Stripe con validación
    const successUrl = getFullUrl(`/checkout/success?session_id={CHECKOUT_SESSION_ID}`)
    const cancelUrl = getFullUrl("/checkout/cancel")

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        order_id: orderId.toString(),
        order_number: orderNumber,
      },
      shipping_address_collection: {
        allowed_countries: ["ES"],
      },
      billing_address_collection: "required",
      customer_email: customerInfo.email,
    })

    // Actualizar el pedido con el ID de sesión de Stripe
    const updateOrderQuery = `
      UPDATE orders SET stripe_session_id = ? WHERE id = ?
    `
    await executeQuery(updateOrderQuery, [session.id, orderId])

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error("Error al crear la sesión de checkout:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
