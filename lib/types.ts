export interface Product {
  id: number
  name: string
  description: string
  price: number
  image_url: string
  category_id: number
  category_name?: string
  stock_quantity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  description: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: number
  order_number: string
  customer_email: string
  customer_first_name: string
  customer_last_name: string
  shipping_address: string
  shipping_city: string
  shipping_postal_code: string
  subtotal: number
  shipping_cost: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  payment_status: "pending" | "completed" | "failed"
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  product_price: number
  quantity: number
  subtotal: number
  created_at: string
}

export interface CartItem {
  id: number
  name: string
  price: number
  image_url: string
  description: string
  category_name: string
  quantity: number
}
