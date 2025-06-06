import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Zap, Shield, Truck, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-950/20 to-black">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              VAPE
            </span>
            <br />
            <span className="text-white">PREMIUM</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubre la experiencia definitiva con nuestra colección exclusiva de vapers de alta gama
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
                Ver Catálogo
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-accent text-accent hover:bg-accent hover:text-black px-8 py-4 text-lg"
            >
              Más Información
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white">
            ¿Por qué elegir <span className="text-primary">VapeStore</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-card border-red-900/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Calidad Premium</h3>
                <p className="text-muted-foreground">
                  Solo trabajamos con las mejores marcas y productos de máxima calidad
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card border-red-900/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Envío Rápido</h3>
                <p className="text-muted-foreground">Entrega en 24-48h en toda España con seguimiento completo</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-red-900/20 hover:border-primary/50 transition-colors">
              <CardContent className="p-6 text-center">
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-white">Garantía Total</h3>
                <p className="text-muted-foreground">Garantía completa en todos nuestros productos y soporte técnico</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Únete a la experiencia <span className="text-primary">VapeStore</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Miles de clientes satisfechos ya disfrutan de nuestros productos premium
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg">
              <Zap className="h-5 w-5 mr-2" />
              Explorar Productos
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
