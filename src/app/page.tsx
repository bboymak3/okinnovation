"use client";

import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  ChevronRight,
  Star,
  Shield,
  Wrench,
  Truck,
  Instagram,
  ChevronUp,
  Heart,
  Zap,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import {
  useCartStore,
  type Product,
  type CartItem,
} from "@/lib/cart-store";
import { motion, AnimatePresence } from "framer-motion";

// ==================== PRODUCT DATA ====================
const products: Product[] = [
  {
    id: "bumper-delantero",
    name: "Bumper Delantero Off-Road",
    description:
      "Bumper delantero fabricado en plancha de acero con tratamiento anticorrosion. Incluye soporte para barra LED, gancho de remolque y proteccion de faros. Disponible para Toyota Hilux, Ford Ranger, Mitsubishi L200, Nissan Frontier y mas modelos.",
    price: "Cotizar",
    category: "Bumpers",
    image: "/products/bumper.png",
    featured: true,
  },
  {
    id: "suspension-lift",
    name: "Kit de Suspension Elevada",
    description:
      "Kit completo de suspension lift para tu 4x4. Incluye amortiguadores de gas de alta gama, resortes reforzados y bujes poliuretano. Mejora la distancia al suelo y el rendimiento off-road de tu vehiculo.",
    price: "Cotizar",
    category: "Suspension",
    image: "/products/suspension.png",
    featured: true,
  },
  {
    id: "boveda-techo",
    name: "Boveda y Trapecio de Techo",
    description:
      "Boveda y trapecio de techo fabricados en acero o aluminio con tratamiento anticorrosion. Soporta hasta 150kg de carga. Incluye sistema de iluminacion LED integrada y compatible con portaequipajes universales.",
    price: "Cotizar",
    category: "Estructuras",
    image: "/products/techo.png",
    featured: true,
  },
  {
    id: "estribos",
    name: "Estribos Electricos y Fijos",
    description:
      "Estribos electricos con motor retráctil o fijos de acero inoxidable. Superficie antideslizante, soporta hasta 200kg por lado. Instalacion profesional incluida para todos los modelos de camionetas y SUVs.",
    price: "Cotizar",
    category: "Estribos",
    image: "/products/estribos.png",
    featured: false,
  },
  {
    id: "iluminacion-led",
    name: "Kit de Iluminacion LED",
    description:
      "Barra LED curved de 42 pulgadas con 240W de potencia. Incluye luces de trabajo, faros auxiliares LED y luces posicionales. Certificacion IP68 resistente al agua y polvo. Luminosidad de 12000 lumenes.",
    price: "Cotizar",
    category: "Iluminacion",
    image: "/products/iluminacion.png",
    featured: true,
  },
  {
    id: "proteccion-carter",
    name: "Proteccion de Carter y Chasis",
    description:
      "Placas de proteccion de carter, transmision y diferencial fabricadas en acero al carbono de 4mm de espesor. Protege los componentes vitales de tu vehiculo contra rocas, obstaculos y terreno accidentado.",
    price: "Cotizar",
    category: "Proteccion",
    image: "/products/proteccion.png",
    featured: false,
  },
  {
    id: "overfender",
    name: "Overfenders y Body Kit",
    description:
      "Overfenders ensanchadores de guardafangos para un look mas agresivo. Fabricados en fibra de vidrio o ABS de alta resistencia. Disponible para Toyota Hilux, Ford Ranger, Mitsubishi L200, Jeep Wrangler y mas.",
    price: "Cotizar",
    category: "Estetica",
    image: "/products/overfender.png",
    featured: false,
  },
];

const categories = [
  "Todos",
  "Bumpers",
  "Suspension",
  "Estructuras",
  "Estribos",
  "Iluminacion",
  "Proteccion",
  "Estetica",
];

// ==================== ANIMATION VARIANTS ====================
const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

// ==================== MAIN PAGE ====================
export default function Home() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    vehiculo: "",
    mensaje: "",
  });
  const [contactSent, setContactSent] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const {
    items,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    toggleCart,
    setCartOpen,
  } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts =
    activeCategory === "Todos"
      ? products
      : products.filter((p) => p.category === activeCategory);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  const handleSendMessage = () => {
    const message = items.length > 0
      ? `Hola OKINNOVATION! Me interesa cotizar los siguientes productos:\n\n${items.map(i => `- ${i.name} (x${i.quantity})`).join("\n")}\n\nMi nombre: ${formData.nombre || ""}\nTelefono: ${formData.telefono || ""}\nVehiculo: ${formData.vehiculo || ""}\nMensaje: ${formData.mensaje || ""}`
      : `Hola OKINNOVATION! Me gustaria obtener informacion.\n\nNombre: ${formData.nombre || ""}\nTelefono: ${formData.telefono || ""}\nVehiculo: ${formData.vehiculo || ""}\nMensaje: ${formData.mensaje || ""}`;
    
    window.open(
      `https://wa.me/51918286293?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ==================== HEADER ==================== */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">OK</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight tracking-tight">
                  OKINNOVATION <span className="text-orange-600">PE</span>
                </h1>
                <p className="text-[10px] text-muted-foreground leading-tight hidden sm:block">
                  Fabricacion & Accesorios Off-Road
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: "Inicio", id: "hero" },
                { label: "Productos", id: "productos" },
                { label: "Nosotros", id: "nosotros" },
                { label: "Contacto", id: "contacto" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-orange-600 text-white text-[10px]">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              <Button
                size="sm"
                className="hidden sm:flex bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() =>
                  window.open(
                    "https://wa.me/51918286293",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border bg-background"
            >
              <div className="px-4 py-3 space-y-1">
                {[
                  { label: "Inicio", id: "hero" },
                  { label: "Productos", id: "productos" },
                  { label: "Nosotros", id: "nosotros" },
                  { label: "Contacto", id: "contacto" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
                <Button
                  size="sm"
                  className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white"
                  onClick={() =>
                    window.open(
                      "https://wa.me/51918286293",
                      "_blank"
                    )
                  }
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp: 918 286 293
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ==================== HERO SECTION ==================== */}
      <section id="hero" className="relative pt-16 min-h-[90vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="/products/hero.png"
            alt="4x4 Off-Road Truck"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <Badge className="mb-4 bg-orange-600 text-white border-none text-sm px-4 py-1">
              <Zap className="h-3 w-3 mr-1" />
              Taller Especializado en Peru
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-4">
              LLEVAMOS LA
              <span className="text-orange-500 block">PERSONALIZACION</span>
              A OTRO NIVEL
              <span className="text-orange-500"> 4X4</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-lg leading-relaxed">
              Fabricacion artesanal de accesorios off-road de alta calidad.
              Bumpers, suspension, estribos, iluminacion LED y mucho mas para
              tu 4x4.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white text-base px-8 py-6 rounded-lg"
                onClick={() => scrollToSection("productos")}
              >
                Ver Productos
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-base px-8 py-6 rounded-lg backdrop-blur-sm"
                onClick={() =>
                  window.open(
                    "https://wa.me/51918286293?text=Hola%20OKINNOVATION!%20Me%20gustaria%20cotizar%20accesorios%20para%20mi%204x4",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Cotizar por WhatsApp
              </Button>
            </div>
            <div className="flex items-center gap-8 mt-10 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-500 fill-orange-500" />
                <span>+6,400 seguidores</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-orange-500" />
                <span>Garantia de calidad</span>
              </div>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-500" />
                <span>Hecho a medida</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURES BAR ==================== */}
      <section className="bg-orange-600 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            <div className="flex flex-col items-center gap-1">
              <Wrench className="h-6 w-6" />
              <span className="font-bold text-lg">Fabricacion Propia</span>
              <span className="text-orange-100 text-sm">
                Todo fabricado en nuestro taller
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Shield className="h-6 w-6" />
              <span className="font-bold text-lg">Garantia</span>
              <span className="text-orange-100 text-sm">
                Respaldamos nuestro trabajo
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Truck className="h-6 w-6" />
              <span className="font-bold text-lg">Envios a Todo Peru</span>
              <span className="text-orange-100 text-sm">
                Lima y provincias
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <MessageCircle className="h-6 w-6" />
              <span className="font-bold text-lg">Atencion Rapida</span>
              <span className="text-orange-100 text-sm">
                WhatsApp 918 286 293
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRODUCTS SECTION ==================== */}
      <section id="productos" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-orange-600 text-orange-600">
              <Zap className="h-3 w-3 mr-1" />
              Nuestros Productos
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
              Accesorios Off-Road
              <span className="text-orange-600"> de Alta Calidad</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cada accesorio esta fabricado con materiales de primera calidad,
              pensado para resistir las condiciones mas extremas del terreno
              off-road.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            {...fadeInUp}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className={
                  activeCategory === cat
                    ? "bg-orange-600 hover:bg-orange-700 text-white"
                    : "hover:border-orange-600 hover:text-orange-600"
                }
              >
                {cat}
              </Button>
            ))}
          </motion.div>

          {/* Product Grid */}
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="group overflow-hidden border-border hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full flex flex-col">
                    <div
                      className="relative overflow-hidden aspect-square bg-muted"
                      onClick={() => handleProductClick(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.featured && (
                        <Badge className="absolute top-3 left-3 bg-orange-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileHover={{ opacity: 1, scale: 1 }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                          <Eye className="h-8 w-8 text-white" />
                        </motion.div>
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant="secondary" className="mb-2 text-xs">
                            {product.category}
                          </Badge>
                          <CardTitle className="text-lg leading-snug">
                            {product.name}
                          </CardTitle>
                        </div>
                        <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 transition-colors shrink-0 mt-1" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <CardDescription className="line-clamp-2 text-sm">
                        {product.description}
                      </CardDescription>
                    </CardContent>
                    <CardFooter className="flex gap-2 pt-3 border-t">
                      <Button
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.price}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          window.open(
                            `https://wa.me/51918286293?text=Hola! Me interesa cotizar: ${encodeURIComponent(product.name)}`,
                            "_blank"
                          );
                        }}
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ==================== ABOUT / NOSOTROS SECTION ==================== */}
      <section id="nosotros" className="py-16 sm:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <img
                  src="/products/taller.png"
                  alt="Taller OKINNOVATION PE"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <div className="flex items-center gap-4 text-white">
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-500">
                        5+
                      </div>
                      <div className="text-xs text-gray-300">Anos de experiencia</div>
                    </div>
                    <Separator orientation="vertical" className="h-12 bg-white/30" />
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-500">
                        500+
                      </div>
                      <div className="text-xs text-gray-300">Proyectos realizados</div>
                    </div>
                    <Separator orientation="vertical" className="h-12 bg-white/30" />
                    <div className="text-center">
                      <div className="text-3xl font-black text-orange-500">
                        6.4K
                      </div>
                      <div className="text-xs text-gray-300">Seguidores</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div {...fadeInUp} className="space-y-6">
              <Badge variant="outline" className="border-orange-600 text-orange-600">
                Sobre Nosotros
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Somos{" "}
                <span className="text-orange-600">OKINNOVATION PE</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Somos un taller especializado en la fabricacion y personalizacion
                de accesorios off-road para vehiculos 4x4. Con mas de 5 anos de
                experiencia en el mercado peruano, nos hemos convertido en una
                referencia para los amantes del off-road que buscan calidad,
                diseno y durabilidad.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nuestro equipo de profesionales altamente capacitados trabaja con
                materiales de primera calidad para crear productos que no solo se
                ven increibles, sino que tambien resisten las condiciones mas
                exigentes del terreno off-road. Cada proyecto es tratado con la
                misma dedicacion y atencion al detalle, asegurando resultados que
                superan las expectativas de nuestros clientes.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Fabricacion Artesanal</h4>
                    <p className="text-muted-foreground text-xs">
                      Cada pieza hecha a mano con precision
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Materiales Premium</h4>
                    <p className="text-muted-foreground text-xs">
                      Acero de alta resistencia y aleaciones
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Truck className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Envios Nacionales</h4>
                    <p className="text-muted-foreground text-xs">
                      Lima y todas las provincias del Peru
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Diseno a Medida</h4>
                    <p className="text-muted-foreground text-xs">
                      Personalizamos segun tu vehiculo
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== SOCIAL / GALLERY SECTION ==================== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              Siguenos en{" "}
              <span className="text-orange-600">Redes Sociales</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Mira nuestros proyectos en TikTok e Instagram. Mas de 6,400
              seguidores confian en nosotros.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div {...fadeInUp}>
              <Card className="text-center hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                    <Instagram className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Instagram</CardTitle>
                  <CardDescription>@okinnovationoficial</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black text-orange-600">3,359</p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
                    onClick={() =>
                      window.open(
                        "https://www.instagram.com/okinnovationoficial",
                        "_blank"
                      )
                    }
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Seguir
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card className="text-center hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-black flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-6 w-6 text-white"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46 6.3 6.3 0 001.86-4.48V8.73a8.19 8.19 0 004.72 1.5V6.79a4.85 4.85 0 01-1-.1z" />
                    </svg>
                  </div>
                  <CardTitle className="text-lg">TikTok</CardTitle>
                  <CardDescription>@okinnovationoficial</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black text-orange-600">6,472</p>
                  <p className="text-sm text-muted-foreground">Seguidores</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
                    onClick={() =>
                      window.open(
                        "https://www.tiktok.com/@okinnovationoficial",
                        "_blank"
                      )
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="h-4 w-4 mr-2"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46 6.3 6.3 0 001.86-4.48V8.73a8.19 8.19 0 004.72 1.5V6.79a4.85 4.85 0 01-1-.1z" />
                    </svg>
                    Seguir
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            <motion.div {...fadeInUp}>
              <Card className="text-center hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-600 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">WhatsApp</CardTitle>
                  <CardDescription>Atencion directa</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-black text-orange-600">24/7</p>
                  <p className="text-sm text-muted-foreground">
                    Respuesta rapida
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full hover:bg-orange-50 hover:border-orange-600 hover:text-orange-600"
                    onClick={() =>
                      window.open(
                        "https://wa.me/51918286293",
                        "_blank"
                      )
                    }
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Escribir
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contacto" className="py-16 sm:py-24 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <Badge variant="outline" className="mb-4 border-orange-600 text-orange-600">
              Contacto
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
              <span className="text-orange-600">Cotiza</span> tu Proyecto
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Llena el formulario o escribenos directamente por WhatsApp para una
              cotizacion personalizada y rapida.
            </p>
          </motion.div>
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <motion.div {...fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Envianos un Mensaje</CardTitle>
                  <CardDescription>
                    Te responderemos lo antes posible por WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Nombre completo
                    </label>
                    <Input
                      placeholder="Tu nombre"
                      value={formData.nombre}
                      onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Telefono / WhatsApp
                    </label>
                    <Input
                      placeholder="Ej: 999 999 999"
                      value={formData.telefono}
                      onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Vehiculo (marca, modelo, anio)
                    </label>
                    <Input
                      placeholder="Ej: Toyota Hilux 2024"
                      value={formData.vehiculo}
                      onChange={(e) =>
                        setFormData({ ...formData, vehiculo: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">
                      Mensaje / Accesorios de interes
                    </label>
                    <Textarea
                      placeholder="Cuentanos que accesorios necesitas o describe tu proyecto..."
                      rows={4}
                      value={formData.mensaje}
                      onChange={(e) =>
                        setFormData({ ...formData, mensaje: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white text-base py-6"
                    onClick={handleSendMessage}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Enviar por WhatsApp
                  </Button>
                  {items.length > 0 && (
                    <p className="text-sm text-muted-foreground text-center">
                      Se incluiran los {totalItems} productos seleccionados en tu
                      mensaje
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
            {/* Contact Info */}
            <motion.div {...fadeInUp} className="space-y-6">
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-800">
                    <MapPin className="h-5 w-5 text-orange-600" />
                    Visitanos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Av Las Almendras 409, Urb Naranjal,
                    <br />
                    Distrito San Martin de Porres
                    <br />
                    Lima, Peru
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-orange-600" />
                    Telefono & WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <a
                    href="tel:+51918286293"
                    className="text-lg font-semibold text-orange-600 hover:underline"
                  >
                    +51 918 286 293
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">
                    Lun - Sab: 8:00 AM - 6:00 PM
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-orange-600" />
                    Vehiculos que Trabajamos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Toyota Hilux",
                      "Ford Ranger",
                      "Mitsubishi L200",
                      "Nissan Frontier",
                      "Jeep Wrangler",
                      "Ford Explorer",
                      "Honda CR-V",
                      "Chevrolet Colorado",
                      "Mahindra",
                      "Cherokee",
                    ].map((v) => (
                      <Badge
                        key={v}
                        variant="secondary"
                        className="text-xs"
                      >
                        {v}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-black text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">
                        Prefieres escribir directo?
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Haz clic y habla con nosotros ahora mismo
                      </p>
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white text-base py-6"
                    onClick={() =>
                      window.open(
                        "https://wa.me/51918286293?text=Hola%20OKINNOVATION!%20Me%20gustaria%20obtener%20mas%20informacion%20sobre%20sus%20accesorios%20off-road",
                        "_blank"
                      )
                    }
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Abrir WhatsApp
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">OK</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    OKINNOVATION <span className="text-orange-500">PE</span>
                  </h3>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Fabricacion & Accesorios Off-Road. Llevamos la personalizacion a
                otro nivel 4x4.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    window.open(
                      "https://www.instagram.com/okinnovationoficial",
                      "_blank"
                    )
                  }
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.tiktok.com/@okinnovationoficial",
                      "_blank"
                    )
                  }
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="currentColor"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46 6.3 6.3 0 001.86-4.48V8.73a8.19 8.19 0 004.72 1.5V6.79a4.85 4.85 0 01-1-.1z" />
                  </svg>
                </button>
                <button
                  onClick={() =>
                    window.open("https://wa.me/51918286293", "_blank")
                  }
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Products */}
            <div>
              <h4 className="font-bold mb-4">Productos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Bumpers");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Bumpers Off-Road
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Suspension");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Kits de Suspension
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Estructuras");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Bovedas y Trapecios
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Estribos");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Estribos
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Iluminacion");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Iluminacion LED
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveCategory("Proteccion");
                      scrollToSection("productos");
                    }}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Proteccion de Chasis
                  </button>
                </li>
              </ul>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="font-bold mb-4">Enlaces Rapidos</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <button
                    onClick={() => scrollToSection("hero")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Inicio
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("productos")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Catalogo
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("nosotros")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Nosotros
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToSection("contacto")}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Contacto
                  </button>
                </li>
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-orange-500" />
                  <span>
                    Av Las Almendras 409, Urb Naranjal, SMP, Lima
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <a
                    href="tel:+51918286293"
                    className="hover:text-orange-500 transition-colors"
                  >
                    +51 918 286 293
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <a
                    href="https://wa.me/51918286293"
                    target="_blank"
                    className="hover:text-green-500 transition-colors"
                  >
                    WhatsApp Directo
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <Separator className="my-8 bg-white/10" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} OKINNOVATION PE. Todos los
              derechos reservados.
            </p>
            <p>
              Fabricacion & Accesorios Off-Road - Lima, Peru
            </p>
          </div>
        </div>
      </footer>

      {/* ==================== FLOATING WHATSAPP BUTTON ==================== */}
      <a
        href="https://wa.me/51918286293?text=Hola%20OKINNOVATION!%20Me%20gustaria%20obtener%20mas%20informacion"
        target="_blank"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300 hover:scale-110"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* ==================== SCROLL TO TOP ==================== */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center shadow-lg transition-all duration-300"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==================== SHOPPING CART SHEET ==================== */}
      <Sheet open={isOpen} onOpenChange={setCartOpen}>
        <SheetContent className="flex flex-col w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Mi Cotizacion
              {totalItems > 0 && (
                <Badge className="bg-orange-600 text-white">
                  {totalItems}
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-30" />
                <p className="text-lg font-medium">Tu cotizacion esta vacia</p>
                <p className="text-sm mt-1">
                  Agrega productos para cotizar por WhatsApp
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 rounded-lg border bg-card"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {items.length > 0 && (
            <SheetFooter className="flex-col gap-3 pt-4 border-t">
              <Button
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-base"
                onClick={handleSendMessage}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Cotizar {totalItems} producto{totalItems > 1 ? "s" : ""} por WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => useCartStore.getState().clearCart()}
              >
                Vaciar cotizacion
              </Button>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* ==================== PRODUCT DETAIL MODAL ==================== */}
      {showProductModal && selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowProductModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full aspect-video object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setShowProductModal(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>
              {selectedProduct.featured && (
                <Badge className="absolute top-4 left-4 bg-orange-600 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              )}
            </div>
            <div className="p-6 space-y-4">
              <div>
                <Badge variant="secondary" className="mb-2">
                  {selectedProduct.category}
                </Badge>
                <h3 className="text-2xl font-black">{selectedProduct.name}</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {selectedProduct.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-6"
                  onClick={() => {
                    handleAddToCart(selectedProduct);
                    setShowProductModal(false);
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar a Cotizacion
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 py-6"
                  onClick={() => {
                    window.open(
                      `https://wa.me/51918286293?text=Hola! Me interesa cotizar: ${encodeURIComponent(selectedProduct.name)}`,
                      "_blank"
                    );
                  }}
                >
                  <MessageCircle className="h-5 w-5 mr-2 text-green-600" />
                  Cotizar por WhatsApp
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
