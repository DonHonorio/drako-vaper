"use client"

import { useState, useEffect } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, Package, Truck, CheckCircle, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import type { Order, OrderItem } from "@/lib/types"

const statusColors = {
  pending: "bg-yellow-600",
  processing: "bg-blue-600",
  shipped: "bg-purple-600",
  delivered: "bg-green-600",
  cancelled: "bg-red-600",
}

const statusLabels = {
  pending: "Pendiente",
  processing: "Procesando",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default function OrdersPage() {
  const { isAuthenticated, token } = useAdmin()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) return
    fetchOrders()
  }, [isAuthenticated, token])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders", {
        headers: { "x-auth-token": token || "" },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderItems = async (orderId: number) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/items`, {
        headers: { "x-auth-token": token || "" },
      })
      if (response.ok) {
        const data = await response.json()
        setOrderItems(data)
      }
    } catch (error) {
      console.error("Error al cargar items del pedido:", error)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token || "",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        await fetchOrders()
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus as any })
        }
      } else {
        alert("Error al actualizar el estado del pedido")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error al actualizar el estado del pedido")
    }
  }

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order)
    await fetchOrderItems(order.id)
    setIsDetailDialogOpen(true)
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.customer_first_name} ${order.customer_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  if (!isAuthenticated) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra todos los pedidos de la tienda</p>
        </div>
      </div>

      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white">Pedidos</CardTitle>
          <CardDescription>Lista de todos los pedidos realizados</CardDescription>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por número, email o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-secondary border-red-900/20 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-secondary border-red-900/20 text-white">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-white">Cargando pedidos...</span>
            </div>
          ) : (
            <div className="rounded-md border border-red-900/20">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-secondary/50">
                    <TableHead className="text-white">Número</TableHead>
                    <TableHead className="text-white">Cliente</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Total</TableHead>
                    <TableHead className="text-white">Estado</TableHead>
                    <TableHead className="text-white">Fecha</TableHead>
                    <TableHead className="text-white text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No se encontraron pedidos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id} className="hover:bg-secondary/50">
                        <TableCell className="text-white font-medium">{order.order_number}</TableCell>
                        <TableCell className="text-white">
                          {order.customer_first_name} {order.customer_last_name}
                        </TableCell>
                        <TableCell className="text-white">{order.customer_email}</TableCell>
                        <TableCell className="text-white">€{Number(order.total).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
                        </TableCell>
                        <TableCell className="text-white">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Detalles
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                                <Package className="h-4 w-4 mr-2" />
                                Marcar como Procesando
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                                <Truck className="h-4 w-4 mr-2" />
                                Marcar como Enviado
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Marcar como Entregado
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

      {/* Dialog de detalles del pedido */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="bg-card border-red-900/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Detalles del Pedido</DialogTitle>
            <DialogDescription>Información completa del pedido {selectedOrder?.order_number}</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Información del cliente */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="text-white">
                      {selectedOrder.customer_first_name} {selectedOrder.customer_last_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="text-white">{selectedOrder.customer_email}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Dirección:</span>
                    <p className="text-white">
                      {selectedOrder.shipping_address}, {selectedOrder.shipping_city},{" "}
                      {selectedOrder.shipping_postal_code}
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-red-900/20" />

              {/* Items del pedido */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Productos</h3>
                <div className="space-y-2">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-secondary/20 rounded">
                      <div>
                        <p className="text-white font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity} × €{Number(item.product_price).toFixed(2)}
                        </p>
                      </div>
                      <p className="text-white font-semibold">€{Number(item.subtotal).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-red-900/20" />

              {/* Resumen del pedido */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Resumen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-white">€{Number(selectedOrder.subtotal).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envío:</span>
                    <span className="text-white">€{Number(selectedOrder.shipping_cost).toFixed(2)}</span>
                  </div>
                  <Separator className="bg-red-900/20" />
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-white">Total:</span>
                    <span className="text-primary">€{Number(selectedOrder.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estado del pedido */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Estado del Pedido</h3>
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[selectedOrder.status]}>{statusLabels[selectedOrder.status]}</Badge>
                  <Select
                    value={selectedOrder.status}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-48 bg-secondary border-red-900/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="processing">Procesando</SelectItem>
                      <SelectItem value="shipped">Enviado</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
