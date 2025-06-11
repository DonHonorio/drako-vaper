"use client"

import { ArrowLeft, AlertCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <Card className="bg-card border-red-900/20">
        <CardContent className="pt-6 text-center">
          <AlertCircle className="h-24 w-24 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4 text-white">Pago Cancelado</h1>
          <p className="text-muted-foreground mb-6">
            Tu proceso de pago ha sido cancelado. No te preocupes, no se ha realizado ningún cargo.
          </p>
          <p className="text-muted-foreground mb-2">
            Los productos siguen en tu carrito si deseas completar la compra más tarde.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline" className="border-red-900/20">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la Tienda
            </Button>
          </Link>
          <Link href="/cart">
            <Button className="bg-primary hover:bg-primary/90">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Revisar Carrito
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
