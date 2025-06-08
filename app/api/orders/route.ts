import { type NextRequest, NextResponse } from "next/server"
import { getConnection } from "@/lib/database"

export async function POST(request: NextRequest) {
  const connection = await getConnection()

  try {
    await connection.beginTransaction()

    const body = await request.json()
    const { customerInfo, items, subtotal, shippingCost = 4.99, total } = body

    // Generar número de pedido único
    const orderNumber = `VP${Date.now()}${Math.floor(Math.random() * 1000)}`

    // Insertar pedido
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, customer_email, customer_first_name, customer_last_name,
        shipping_address, shipping_city, shipping_postal_code,
        subtotal, shipping_cost, total
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderNumber,
        customerInfo.email,
        customerInfo.firstName,
        customerInfo.lastName,
        customerInfo.address,
        customerInfo.city,
        customerInfo.postalCode,
        subtotal,
        shippingCost,
        total,
      ],
    )

    const orderId = (orderResult as any).insertId

    // Insertar items del pedido
    for (const item of items) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id, product_id, product_name, product_price, quantity, subtotal
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.id, item.name, item.price, item.quantity, item.price * item.quantity],
      )

      // Actualizar stock del producto
      await connection.execute("UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?", [
        item.quantity,
        item.id,
      ])
    }

    await connection.commit()

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId,
    })
  } catch (error) {
    await connection.rollback()
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Error al crear el pedido" }, { status: 500 })
  } finally {
    connection.release()
  }
}
