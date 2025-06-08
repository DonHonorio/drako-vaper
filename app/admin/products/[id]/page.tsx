"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, Upload, X, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import type { Product, Category } from "@/lib/types"

export default function ProductForm() {
  const { id } = useParams()
  const isNewProduct = id === "new"
  const { isAuthenticated, token } = useAdmin()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    image_url: "/placeholder.svg?height=300&width=300",
    category_id: 0,
    stock_quantity: 0,
    is_active: true,
  })

  useEffect(() => {
    if (!isAuthenticated) {
      return
    }

    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/admin/categories", {
          headers: {
            "x-auth-token": token || "",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error)
      }
    }

    const fetchProduct = async () => {
      if (isNewProduct) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          headers: {
            "x-auth-token": token || "",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setFormData(data)
          if (data.image_url && !data.image_url.includes("placeholder")) {
            setImagePreview(data.image_url)
          }
        } else {
          alert("Producto no encontrado")
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error al cargar el producto:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchProduct()
  }, [isAuthenticated, token, id, isNewProduct, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock_quantity" ? Number.parseFloat(value) : value,
    })
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      is_active: checked,
    })
  }

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      category_id: Number.parseInt(value),
    })
  }

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen es demasiado grande. El tamaño máximo es 5MB")
      return
    }

    // Mostrar vista previa
    const reader = new FileReader()
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Subir imagen
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          "x-auth-token": token || "",
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setFormData((prev) => ({
          ...prev,
          image_url: data.imageUrl,
        }))
      } else {
        const error = await response.json()
        alert(`Error al subir la imagen: ${error.error}`)
        setImagePreview(null)
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      alert("Error al subir la imagen")
      setImagePreview(null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setFormData({
      ...formData,
      image_url: "/placeholder.svg?height=300&width=300",
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNewProduct ? "/api/admin/products" : `/api/admin/products/${id}`

      const method = isNewProduct ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push("/admin/products")
      } else {
        const data = await response.json()
        alert(data.error || "Error al guardar el producto")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar el producto")
    } finally {
      setSaving(false)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-white">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/products" className="mr-4">
          <Button variant="outline" size="icon" className="border-red-900/20">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{isNewProduct ? "Nuevo Producto" : "Editar Producto"}</h1>
          <p className="text-muted-foreground">
            {isNewProduct ? "Añade un nuevo producto al catálogo" : "Modifica los detalles del producto"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-card border-red-900/20">
          <CardHeader>
            <CardTitle className="text-white">Información del Producto</CardTitle>
            <CardDescription>Detalles básicos del producto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-white">
                  Precio (€)
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  className="bg-secondary border-red-900/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id" className="text-white">
                  Categoría
                </Label>
                <Select value={formData.category_id?.toString()} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="bg-secondary border-red-900/20 text-white">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="stock_quantity" className="text-white">
                  Stock
                </Label>
                <Input
                  id="stock_quantity"
                  name="stock_quantity"
                  type="number"
                  min="0"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                  required
                  className="bg-secondary border-red-900/20 text-white"
                />
              </div>

              <div className="flex items-center space-x-2 mt-8">
                <Switch id="is_active" checked={formData.is_active} onCheckedChange={handleSwitchChange} />
                <Label htmlFor="is_active" className="text-white">
                  Producto activo
                </Label>
              </div>
            </div>

            {/* Sección de imagen */}
            <div className="space-y-4">
              <Label className="text-white">Imagen del Producto</Label>
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4 border border-red-900/20 rounded-md overflow-hidden">
                  {uploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : null}
                  {imagePreview || formData.image_url ? (
                    <Image
                      src={imagePreview || formData.image_url || "/placeholder.svg?height=300&width=300"}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  {(imagePreview || (formData.image_url && !formData.image_url.includes("placeholder"))) && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="border-red-900/20"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {imagePreview ? "Cambiar imagen" : "Subir imagen"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos permitidos: JPG, PNG, GIF. Tamaño máximo: 5MB
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href="/admin/products">
              <Button variant="outline" className="border-red-900/20">
                Cancelar
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving || uploading}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Producto
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
