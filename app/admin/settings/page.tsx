"use client"

import { useState } from "react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save, Mail, Globe, Shield, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SettingsPage() {
  const { isAuthenticated, token } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    // Configuración de la tienda
    storeName: "VapeStore",
    storeDescription: "La mejor selección de vapers y accesorios premium",
    storeEmail: "info@vapestore.com",
    storePhone: "+34 123 456 789",
    storeAddress: "Calle Principal 123, Madrid, España",

    // Configuración de envío
    freeShippingThreshold: 50,
    standardShippingCost: 4.99,
    expressShippingCost: 9.99,

    // Configuración de notificaciones
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
    lowStockThreshold: 5,

    // Configuración de mantenimiento
    maintenanceMode: false,
    maintenanceMessage: "Estamos realizando mejoras en nuestro sitio. Volveremos pronto.",

    // Configuración de SEO
    metaTitle: "VapeStore - Tienda de Vapers Premium",
    metaDescription: "Descubre la mejor selección de vapers y accesorios con diseño minimalista",
    metaKeywords: "vapers, cigarrillos electrónicos, vapeo, premium",
  })

  const handleInputChange = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simular guardado de configuración
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En una implementación real, aquí harías una petición a la API
      // const response = await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'x-auth-token': token || ''
      //   },
      //   body: JSON.stringify(settings)
      // })

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error("Error al guardar configuración:", error)
      alert("Error al guardar la configuración")
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración general de la tienda</p>
        </div>
        <Button onClick={handleSave} disabled={loading} className="bg-primary hover:bg-primary/90">
          {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
          Guardar Cambios
        </Button>
      </div>

      {saved && (
        <Alert className="bg-green-950/50 border-green-900">
          <AlertDescription className="text-green-400">Configuración guardada correctamente</AlertDescription>
        </Alert>
      )}

      {/* Información de la tienda */}
      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Información de la Tienda
          </CardTitle>
          <CardDescription>Configuración básica de tu tienda online</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-white">
                Nombre de la Tienda
              </Label>
              <Input
                id="storeName"
                value={settings.storeName}
                onChange={(e) => handleInputChange("storeName", e.target.value)}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeEmail" className="text-white">
                Email de Contacto
              </Label>
              <Input
                id="storeEmail"
                type="email"
                value={settings.storeEmail}
                onChange={(e) => handleInputChange("storeEmail", e.target.value)}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeDescription" className="text-white">
              Descripción
            </Label>
            <Textarea
              id="storeDescription"
              value={settings.storeDescription}
              onChange={(e) => handleInputChange("storeDescription", e.target.value)}
              className="bg-secondary border-red-900/20 text-white"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storePhone" className="text-white">
                Teléfono
              </Label>
              <Input
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => handleInputChange("storePhone", e.target.value)}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeAddress" className="text-white">
                Dirección
              </Label>
              <Input
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => handleInputChange("storeAddress", e.target.value)}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración de envío */}
      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white">Configuración de Envío</CardTitle>
          <CardDescription>Gestiona los costos y políticas de envío</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="freeShippingThreshold" className="text-white">
                Envío Gratis a partir de (€)
              </Label>
              <Input
                id="freeShippingThreshold"
                type="number"
                step="0.01"
                value={settings.freeShippingThreshold}
                onChange={(e) => handleInputChange("freeShippingThreshold", Number.parseFloat(e.target.value))}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standardShippingCost" className="text-white">
                Costo Envío Estándar (€)
              </Label>
              <Input
                id="standardShippingCost"
                type="number"
                step="0.01"
                value={settings.standardShippingCost}
                onChange={(e) => handleInputChange("standardShippingCost", Number.parseFloat(e.target.value))}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expressShippingCost" className="text-white">
                Costo Envío Express (€)
              </Label>
              <Input
                id="expressShippingCost"
                type="number"
                step="0.01"
                value={settings.expressShippingCost}
                onChange={(e) => handleInputChange("expressShippingCost", Number.parseFloat(e.target.value))}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Mail className="h-5 w-5 mr-2" />
            Notificaciones
          </CardTitle>
          <CardDescription>Configura las notificaciones automáticas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Notificaciones por Email</Label>
              <p className="text-sm text-muted-foreground">Recibir notificaciones generales por email</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleInputChange("emailNotifications", checked)}
            />
          </div>
          <Separator className="bg-red-900/20" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Notificaciones de Pedidos</Label>
              <p className="text-sm text-muted-foreground">Notificar cuando se reciban nuevos pedidos</p>
            </div>
            <Switch
              checked={settings.orderNotifications}
              onCheckedChange={(checked) => handleInputChange("orderNotifications", checked)}
            />
          </div>
          <Separator className="bg-red-900/20" />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Alertas de Stock Bajo</Label>
              <p className="text-sm text-muted-foreground">Notificar cuando el stock esté bajo</p>
            </div>
            <Switch
              checked={settings.lowStockNotifications}
              onCheckedChange={(checked) => handleInputChange("lowStockNotifications", checked)}
            />
          </div>
          {settings.lowStockNotifications && (
            <div className="space-y-2">
              <Label htmlFor="lowStockThreshold" className="text-white">
                Umbral de Stock Bajo
              </Label>
              <Input
                id="lowStockThreshold"
                type="number"
                value={settings.lowStockThreshold}
                onChange={(e) => handleInputChange("lowStockThreshold", Number.parseInt(e.target.value))}
                className="bg-secondary border-red-900/20 text-white w-32"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mantenimiento */}
      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Modo Mantenimiento
          </CardTitle>
          <CardDescription>Activa el modo mantenimiento para realizar actualizaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-white">Activar Modo Mantenimiento</Label>
              <p className="text-sm text-muted-foreground">Los usuarios verán una página de mantenimiento</p>
            </div>
            <Switch
              checked={settings.maintenanceMode}
              onCheckedChange={(checked) => handleInputChange("maintenanceMode", checked)}
            />
          </div>
          {settings.maintenanceMode && (
            <div className="space-y-2">
              <Label htmlFor="maintenanceMessage" className="text-white">
                Mensaje de Mantenimiento
              </Label>
              <Textarea
                id="maintenanceMessage"
                value={settings.maintenanceMessage}
                onChange={(e) => handleInputChange("maintenanceMessage", e.target.value)}
                className="bg-secondary border-red-900/20 text-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="bg-card border-red-900/20">
        <CardHeader>
          <CardTitle className="text-white">Configuración SEO</CardTitle>
          <CardDescription>Optimiza tu tienda para motores de búsqueda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="text-white">
              Título Meta
            </Label>
            <Input
              id="metaTitle"
              value={settings.metaTitle}
              onChange={(e) => handleInputChange("metaTitle", e.target.value)}
              className="bg-secondary border-red-900/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-white">
              Descripción Meta
            </Label>
            <Textarea
              id="metaDescription"
              value={settings.metaDescription}
              onChange={(e) => handleInputChange("metaDescription", e.target.value)}
              className="bg-secondary border-red-900/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaKeywords" className="text-white">
              Palabras Clave
            </Label>
            <Input
              id="metaKeywords"
              value={settings.metaKeywords}
              onChange={(e) => handleInputChange("metaKeywords", e.target.value)}
              className="bg-secondary border-red-900/20 text-white"
              placeholder="Separadas por comas"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
