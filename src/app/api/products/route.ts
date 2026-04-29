import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const products = await db.product.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, price, category, image, featured, order } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Nombre y categoria son requeridos" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || "",
        price: price || "Cotizar",
        category: category || "Bumpers",
        image: image || "/products/bumper.png",
        featured: featured || false,
        order: order || 0,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
