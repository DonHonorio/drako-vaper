"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { Product } from "@/lib/types"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart()

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", payload: product })
  }

  return (
    <Card className="group overflow-hidden border-red-900/20 bg-card hover:border-primary/50 transition-all duration-300">
      <div className="relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          width={300}
          height={300}
          className="aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-2 right-2 bg-accent text-black">{product.category}</Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-white">{product.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">€{Number(product.price).toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 text-white">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir al Carrito
        </Button>
      </CardFooter>
    </Card>
  )
}
