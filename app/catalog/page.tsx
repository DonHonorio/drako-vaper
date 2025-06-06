"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { Product } from "@/lib/cart-context"

// Datos de ejemplo de productos
const products: Product[] = [
  {
    id: "1",
    name: "Vape Elite Pro",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Vaper premium con batería de larga duración y control de temperatura avanzado",
    category: "Premium",
  },
  {
    id: "2",
    name: "Cloud Master X",
    price: 65.5,
    image: "/placeholder.svg?height=300&width=300",
    description: "Perfecto para grandes nubes de vapor con sistema de airflow ajustable",
    category: "Avanzado",
  },
  {
    id: "3",
    name: "Stealth Vape Mini",
    price: 45.0,
    image: "/placeholder.svg?height=300&width=300",
    description: "Compacto y discreto, ideal para principiantes y uso diario",
    category: "Básico",
  },
  {
    id: "4",
    name: "Dragon Fire RDA",
    price: 120.0,
    image: "/placeholder.svg?height=300&width=300",
    description: "RDA profesional para expertos en vapeo con deck de construcción dual",
    category: "Profesional",
  },
  {
    id: "5",
    name: "Mystic Pod System",
    price: 35.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Sistema de pods recargables con sabores intensos y duraderos",
    category: "Pod",
  },
  {
    id: "6",
    name: "Thunder Mod 200W",
    price: 95.0,
    image: "/placeholder.svg?height=300&width=300",
    description: "Mod de alta potencia con pantalla OLED y múltiples modos de vapeo",
    category: "Mod",
  },
]

export default function CatalogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  const filteredProducts = products
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Catálogo de <span className="text-primary">Productos</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Descubre nuestra selección completa de vapers y accesorios premium
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-red-900/20 text-white"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48 bg-card border-red-900/20 text-white">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Todas las categorías" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48 bg-card border-red-900/20 text-white">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Nombre</SelectItem>
            <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No se encontraron productos que coincidan con tu búsqueda.</p>
          <Button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("all")
            }}
            className="mt-4 bg-primary hover:bg-primary/90"
          >
            Limpiar filtros
          </Button>
        </div>
      )}
    </div>
  )
}
