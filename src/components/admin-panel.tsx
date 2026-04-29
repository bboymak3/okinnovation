"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  ImageIcon,
  LogOut,
  Star,
  Package,
  Search,
  Loader2,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export interface ProductDB {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  featured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "Bumpers",
  "Suspension",
  "Estructuras",
  "Estribos",
  "Iluminacion",
  "Proteccion",
  "Estetica",
];

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [products, setProducts] = useState<ProductDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editProduct, setEditProduct] = useState<ProductDB | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("Cotizar");
  const [formCategory, setFormCategory] = useState("Bumpers");
  const [formImage, setFormImage] = useState("/products/bumper.png");
  const [formFeatured, setFormFeatured] = useState(false);
  const [formOrder, setFormOrder] = useState(0);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const openNewProduct = () => {
    setIsNew(true);
    setFormName("");
    setFormDescription("");
    setFormPrice("Cotizar");
    setFormCategory("Bumpers");
    setFormImage("/products/bumper.png");
    setFormFeatured(false);
    setFormOrder(products.length + 1);
    setEditProduct(null);
  };

  const openEditProduct = (product: ProductDB) => {
    setIsNew(false);
    setEditProduct(product);
    setFormName(product.name);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormCategory(product.category);
    setFormImage(product.image);
    setFormFeatured(product.featured);
    setFormOrder(product.order);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El archivo es demasiado grande. Maximo 5MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormImage(data.url);
      } else {
        const err = await res.json();
        alert(err.error || "Error al subir imagen");
      }
    } catch {
      alert("Error al subir imagen");
    } finally {
      setUploading(false);
    }
    // Reset input
    e.target.value = "";
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      alert("El nombre del producto es requerido");
      return;
    }

    setSaving(true);
    try {
      const body = {
        name: formName.trim(),
        description: formDescription.trim(),
        price: formPrice.trim() || "Cotizar",
        category: formCategory,
        image: formImage,
        featured: formFeatured,
        order: formOrder,
      };

      let res: Response;
      if (isNew) {
        res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else if (editProduct) {
        res = await fetch(`/api/products/${editProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        return;
      }

      if (res.ok) {
        await fetchProducts();
        setEditProduct(null);
        setIsNew(false);
      } else {
        const err = await res.json();
        alert(err.error || "Error al guardar");
      }
    } catch {
      alert("Error de conexion");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Estas seguro de eliminar este producto?")) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchProducts();
      } else {
        alert("Error al eliminar");
      }
    } catch {
      alert("Error de conexion");
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isEditing = editProduct !== null || isNew;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">OK</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Admin Panel
                </h1>
                <p className="text-xs text-muted-foreground">
                  Gestion de productos OKINNOVATION PE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:flex">
                <Package className="h-3 w-3 mr-1" />
                {products.length} productos
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (
                    isEditing &&
                    !confirm("Tienes cambios sin guardar. Salir de todas formas?")
                  )
                    return;
                  onLogout();
                }}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ver Tienda
              </Button>
              <Button variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <Button
            onClick={openNewProduct}
            className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Product List */}
            <div className="lg:col-span-1 space-y-2">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
                Productos ({filteredProducts.length})
              </h3>
              <div className="space-y-1.5 max-h-[calc(100vh-240px)] overflow-y-auto pr-1">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      editProduct?.id === product.id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                    }`}
                    onClick={() => {
                      if (isEditing && editProduct?.id !== product.id) {
                        if (
                          confirm("Tienes cambios sin guardar. Cambiar de producto?")
                        ) {
                          openEditProduct(product);
                        }
                      } else if (!isEditing) {
                        openEditProduct(product);
                      }
                    }}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-md object-cover bg-muted shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-medium text-sm truncate">
                          {product.name}
                        </p>
                        {product.featured && (
                          <Star className="h-3 w-3 text-orange-500 fill-orange-500 shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {product.category}
                        </Badge>
                        <span className="truncate">{product.price}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewImage(product.image);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product.id);
                        }}
                        disabled={deleting === product.id}
                      >
                        {deleting === product.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No se encontraron productos</p>
                  </div>
                )}
              </div>
            </div>

            {/* Editor Panel */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-bold text-lg">
                      {isNew ? "Nuevo Producto" : "Editar Producto"}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditProduct(null);
                        setIsNew(false);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Image Upload */}
                    <div>
                      <Label className="text-sm font-medium mb-2 block">
                        Imagen del Producto
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-48 h-48 rounded-lg overflow-hidden bg-muted border-2 border-dashed border-gray-300 flex items-center justify-center">
                          {formImage ? (
                            <img
                              src={formImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                          )}
                          {uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <label className="flex items-center justify-center gap-2 w-full h-11 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-muted-foreground">
                              <Upload className="h-4 w-4" />
                              {uploading
                                ? "Subiendo..."
                                : "Subir imagen (JPG, PNG, WebP)"}
                              <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleUpload}
                                className="hidden"
                                disabled={uploading}
                              />
                            </label>
                            <p className="text-xs text-muted-foreground mt-1">
                              Maximo 5MB. Se guardara en /uploads/
                            </p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground mb-1 block">
                              O ingresa URL de imagen:
                            </Label>
                            <Input
                              placeholder="https://ejemplo.com/imagen.jpg"
                              value={
                                formImage.startsWith("/products/")
                                  ? ""
                                  : formImage
                              }
                              onChange={(e) => setFormImage(e.target.value)}
                            />
                          </div>
                          {formImage && (
                            <p className="text-xs text-muted-foreground bg-gray-50 rounded px-2 py-1 truncate">
                              {formImage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <Label htmlFor="name">Nombre del Producto *</Label>
                        <Input
                          id="name"
                          placeholder="Ej: Bumper Delantero Off-Road"
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Categoria *</Label>
                        <Select
                          value={formCategory}
                          onValueChange={setFormCategory}
                        >
                          <SelectTrigger className="mt-1.5">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="price">Precio</Label>
                        <Input
                          id="price"
                          placeholder="Ej: S/1,500.00 o Cotizar"
                          value={formPrice}
                          onChange={(e) => setFormPrice(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="description">Descripcion</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe el producto detalladamente..."
                          rows={5}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="order">Orden</Label>
                        <Input
                          id="order"
                          type="number"
                          min={0}
                          value={formOrder}
                          onChange={(e) =>
                            setFormOrder(parseInt(e.target.value) || 0)
                          }
                          className="mt-1.5"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Menor = aparece primero
                        </p>
                      </div>
                      <div className="flex items-center gap-3 pt-6">
                        <Switch
                          id="featured"
                          checked={formFeatured}
                          onCheckedChange={setFormFeatured}
                        />
                        <Label htmlFor="featured" className="cursor-pointer">
                          Producto destacado
                        </Label>
                        {formFeatured && (
                          <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Save Actions */}
                  <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditProduct(null);
                        setIsNew(false);
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saving || !formName.trim()}
                      className="bg-orange-600 hover:bg-orange-700 text-white min-w-[120px]"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {isNew ? "Crear Producto" : "Guardar Cambios"}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                /* Empty State - No Product Selected */
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    Selecciona un producto
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Haz clic en un producto de la lista para editarlo, o crea
                    uno nuevo con el boton de arriba.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vista previa de imagen</DialogTitle>
            <DialogDescription>Imagen del producto</DialogDescription>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
    </div>
  );
}
