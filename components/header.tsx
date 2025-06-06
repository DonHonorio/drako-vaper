"use client"

import Link from "next/link"
import { ShoppingCart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"

export function Header() {
  const { state } = useCart()
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-red-900/20 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            VapeStore
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-white hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/catalog" className="text-white hover:text-primary transition-colors">
            Catálogo
          </Link>
          <Link href="/about" className="text-white hover:text-primary transition-colors">
            Nosotros
          </Link>
        </nav>

        <Link href="/cart">
          <Button
            variant="outline"
            size="sm"
            className="relative border-primary text-primary hover:bg-primary hover:text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white text-xs">
                {itemCount}
              </Badge>
            )}
          </Button>
        </Link>
      </div>
    </header>
  )
}
