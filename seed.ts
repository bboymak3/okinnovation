import { db } from "./src/lib/db";

async function seed() {
  console.log("Seeding database...");

  const products = [
    {
      name: "Bumper Delantero Off-Road",
      description:
        "Bumper delantero fabricado en plancha de acero con tratamiento anticorrosion. Incluye soporte para barra LED, gancho de remolque y proteccion de faros. Disponible para Toyota Hilux, Ford Ranger, Mitsubishi L200, Nissan Frontier y mas modelos.",
      price: "Cotizar",
      category: "Bumpers",
      image: "/products/bumper.png",
      featured: true,
      order: 1,
    },
    {
      name: "Kit de Suspension Elevada",
      description:
        "Kit completo de suspension lift para tu 4x4. Incluye amortiguadores de gas de alta gama, resortes reforzados y bujes poliuretano. Mejora la distancia al suelo y el rendimiento off-road de tu vehiculo.",
      price: "Cotizar",
      category: "Suspension",
      image: "/products/suspension.png",
      featured: true,
      order: 2,
    },
    {
      name: "Boveda y Trapecio de Techo",
      description:
        "Boveda y trapecio de techo fabricados en acero o aluminio con tratamiento anticorrosion. Soporta hasta 150kg de carga. Incluye sistema de iluminacion LED integrada y compatible con portaequipajes universales.",
      price: "Cotizar",
      category: "Estructuras",
      image: "/products/techo.png",
      featured: true,
      order: 3,
    },
    {
      name: "Estribos Electricos y Fijos",
      description:
        "Estribos electricos con motor retráctil o fijos de acero inoxidable. Superficie antideslizante, soporta hasta 200kg por lado. Instalacion profesional incluida para todos los modelos de camionetas y SUVs.",
      price: "Cotizar",
      category: "Estribos",
      image: "/products/estribos.png",
      featured: false,
      order: 4,
    },
    {
      name: "Kit de Iluminacion LED",
      description:
        "Barra LED curved de 42 pulgadas con 240W de potencia. Incluye luces de trabajo, faros auxiliares LED y luces posicionales. Certificacion IP68 resistente al agua y polvo. Luminosidad de 12000 lumenes.",
      price: "Cotizar",
      category: "Iluminacion",
      image: "/products/iluminacion.png",
      featured: true,
      order: 5,
    },
    {
      name: "Proteccion de Carter y Chasis",
      description:
        "Placas de proteccion de carter, transmision y diferencial fabricadas en acero al carbono de 4mm de espesor. Protege los componentes vitales de tu vehiculo contra rocas, obstaculos y terreno accidentado.",
      price: "Cotizar",
      category: "Proteccion",
      image: "/products/proteccion.png",
      featured: false,
      order: 6,
    },
    {
      name: "Overfenders y Body Kit",
      description:
        "Overfenders ensanchadores de guardafangos para un look mas agresivo. Fabricados en fibra de vidrio o ABS de alta resistencia. Disponible para Toyota Hilux, Ford Ranger, Mitsubishi L200, Jeep Wrangler y mas.",
      price: "Cotizar",
      category: "Estetica",
      image: "/products/overfender.png",
      featured: false,
      order: 7,
    },
  ];

  for (const product of products) {
    await db.product.create({ data: product });
    console.log(`  Created: ${product.name}`);
  }

  console.log("Seed complete!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
