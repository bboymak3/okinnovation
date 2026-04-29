import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function GET() {
  try {
    const db = getDB();
    const result = await db
      .prepare("SELECT * FROM products ORDER BY \"order\" ASC")
      .all();
    return NextResponse.json(result.results);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const db = getDB();
    const body = await request.json();
    const { name, description, price, category, image, featured, order } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Nombre y categoria son requeridos" },
        { status: 400 }
      );
    }

    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    await db.prepare(
      `INSERT INTO products (id, name, description, price, category, image, featured, "order")
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      id,
      name,
      description || "",
      price || "Cotizar",
      category || "Bumpers",
      image || "/products/bumper.png",
      featured ? 1 : 0,
      order || 0
    ).run();

    return NextResponse.json(
      { id, name, description, price, category, image, featured, order },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
