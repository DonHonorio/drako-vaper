"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const { dispatch } = useCart()

  useEffect(() => {
    // Limpiar el carrito cuando se llega a esta página
    dispatch({ type: "CLEAR_CART" })
  }, [dispatch])

  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card className="bg-card border-red-900/20">
        <CardContent className="pt-6 text-center">
          <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-white">¡Pedido Completado!</h1>
          <p className="text-muted-foreground mb-6">
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando.
          </p>
          <p className="text-muted-foreground mb-2">
            Recibirás un email de confirmación con los detalles de tu pedido en breve.
          </p>
          {sessionId && <p className="text-xs text-muted-foreground mb-6">ID de transacción: {sessionId}</p>}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="border-red-900/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Tienda
            </Button>
          </Link>
          <Link href="/catalog">
            <Button className="bg-primary hover:bg-primary/90">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Seguir Comprando
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
