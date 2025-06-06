"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simular procesamiento de pago
    await new Promise((resolve) => setTimeout(resolve, 3000))

    setIsProcessing(false)
    setOrderComplete(true)

    // Limpiar carrito después de 2 segundos
    setTimeout(() => {
      dispatch({ type: "CLEAR_CART" })
      router.push("/")
    }, 2000)
  }

  if (state.items.length === 0 && !orderComplete) {
    router.push("/cart")
    return null
  }

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-white">¡Pedido Completado!</h1>
        <p className="text-muted-foreground mb-8">
          Gracias por tu compra. Recibirás un email de confirmación en breve.
        </p>
        <p className="text-sm text-muted-foreground">Redirigiendo a la página principal...</p>
      </div>
    )
  }

  const total = state.total + 4.99

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Finalizar Compra</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información de contacto */}
            <Card className="bg-card border-red-900/20">
              <CardHeader>
                <CardTitle className="text-white">Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-secondary border-red-900/20 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Dirección de envío */}
            <Card className="bg-card border-red-900/20">
              <CardHeader>
                <CardTitle className="text-white">Dirección de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-white">
                      Nombre
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-white">
                      Apellidos
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">
                    Dirección
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="bg-secondary border-red-900/20 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-white">
                      Ciudad
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-white">
                      Código Postal
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de pago */}
            <Card className="bg-card border-red-900/20">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Información de Pago
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="cardName" className="text-white">
                    Nombre en la Tarjeta
                  </Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    required
                    value={formData.cardName}
                    onChange={handleInputChange}
                    className="bg-secondary border-red-900/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="cardNumber" className="text-white">
                    Número de Tarjeta
                  </Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    required
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    className="bg-secondary border-red-900/20 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-white">
                      Fecha de Vencimiento
                    </Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      placeholder="MM/AA"
                      required
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv" className="text-white">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      placeholder="123"
                      required
                      value={formData.cvv}
                      onChange={handleInputChange}
                      className="bg-secondary border-red-900/20 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
            >
              {isProcessing ? (
                <>
                  <Lock className="h-5 w-5 mr-2 animate-spin" />
                  Procesando Pago...
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Pagar €{total.toFixed(2)}
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Resumen del pedido */}
        <div>
          <Card className="bg-card border-red-900/20 sticky top-24">
            <CardHeader>
              <CardTitle className="text-white">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="text-white">€{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <Separator className="bg-red-900/20" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-white">€{state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Envío</span>
                  <span className="text-white">€4.99</span>
                </div>
                <Separator className="bg-red-900/20" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-white">Total</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
