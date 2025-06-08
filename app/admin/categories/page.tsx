"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Category } from "@/lib/types"

export default function CategoriesPage() {
  const { isAuthenticated, token } = useAdmin()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({ name: "", description: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    fetchCategories()
  }, [isAuthenticated, token])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories", {
        headers: { "x-auth-token": token || "" },
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error("Error al cargar categorías:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCategory = async () => {
    setSaving(true)
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : "/api/admin/categories"
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        await fetchCategories()
        setIsDialogOpen(false)
        setEditingCategory(null)
        setFormData({ name: "", description: "" })
      } else {
        alert("Error al guardar la categoría")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al guardar la categoría")
    } finally {
      setSaving(false)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || "" })
    setIsDialogOpen(true)
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta categoría?")) return

    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: "DELETE",
        headers: { "x-auth-token": token || "" },
      })

      if (response.ok) {
        setCategories(categories.filter((cat) => cat.id !== id))
      } else {
        alert("Error al eliminar la categoría")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al eliminar la categoría")
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isAuthenticated) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Administra las categorías de productos</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingCategory(null)
                setFormData({ name: "", description: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-red-900/20">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory ? "Modifica los datos de la categoría" : "Crea una nueva categoría de productos"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-secondary border-red-900/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">
                  Descripción
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-secondary border-red-900/20 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-red-900/20">
                Cancelar
              </Button>
              <Button onClick={handleSaveCategory} disabled={saving} className="bg-primary hover:bg-primary/90">
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {editingCategory ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white">Categorías</CardTitle>
          <CardDescription>Lista de todas las categorías disponibles</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-secondary border-red-900/20 text-white"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-white">Cargando categorías...</span>
            </div>
          ) : (
            <div className="rounded-md border border-red-900/20">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-secondary/50">
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Nombre</TableHead>
                    <TableHead className="text-white">Descripción</TableHead>
                    <TableHead className="text-white">Fecha de Creación</TableHead>
                    <TableHead className="text-white text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        No se encontraron categorías
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category.id} className="hover:bg-secondary/50">
                        <TableCell className="text-white">{category.id}</TableCell>
                        <TableCell className="text-white font-medium">{category.name}</TableCell>
                        <TableCell className="text-white">{category.description || "Sin descripción"}</TableCell>
                        <TableCell className="text-white">
                          {new Date(category.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditCategory(category)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteCategory(category.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
