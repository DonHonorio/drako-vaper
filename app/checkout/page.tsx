"use client"

import type React from "react"

import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Loader2, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"
import { getStripe } from "@/lib/stripe"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { state, dispatch } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
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

    try {
      // Validar formulario
      if (
        !formData.email ||
        !formData.firstName ||
        !formData.lastName ||
        !formData.address ||
        !formData.city ||
        !formData.postalCode
      ) {
        toast({
          title: "Error",
          description: "Por favor, completa todos los campos del formulario",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      // Crear sesión de checkout con Stripe
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: state.items,
          customerInfo: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar el pago")
      }

      // Redirigir a la página de pago de Stripe
      if (data.url) {
        window.location.href = data.url
      } else {
        const stripe = await getStripe()
        await stripe.redirectToCheckout({ sessionId: data.sessionId })
      }
    } catch (error: any) {
      console.error("Error al procesar el pago:", error)
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error al procesar el pago",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (state.items.length === 0) {
    router.push("/cart")
    return null
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

            <div className="bg-card border border-red-900/20 rounded-lg p-4 text-white">
              <div className="flex items-center mb-4">
                <CreditCard className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Información de Pago</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                El pago se procesará de forma segura a través de Stripe. Serás redirigido a la pasarela de pago después
                de confirmar tu pedido.
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Lock className="h-3 w-3 mr-1" />
                Conexión segura con cifrado SSL
              </div>
            </div>

            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Continuar al Pago (€{total.toFixed(2)})
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
                    <p className="text-white">€{(Number(item.price) * item.quantity).toFixed(2)}</p>
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
