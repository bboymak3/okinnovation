import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const result = await db
      .prepare("SELECT * FROM products WHERE id = ?")
      .bind(id)
      .first();

    if (!result) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();
    const body = await request.json();
    const { name, description, price, category, image, featured, order } = body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: unknown[] = [];

    if (name !== undefined) { updates.push('name = ?'); values.push(name); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (image !== undefined) { updates.push('image = ?'); values.push(image); }
    if (featured !== undefined) { updates.push('featured = ?'); values.push(featured ? 1 : 0); }
    if (order !== undefined) { updates.push('"order" = ?'); values.push(order); }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron campos para actualizar" },
        { status: 400 }
      );
    }

    updates.push('updated_at = datetime("now")');
    values.push(id);

    await db.prepare(
      `UPDATE products SET ${updates.join(", ")} WHERE id = ?`
    ).bind(...values).run();

    // Return updated product
    const updated = await db
      .prepare("SELECT * FROM products WHERE id = ?")
      .bind(id)
      .first();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDB();

    await db.prepare("DELETE FROM products WHERE id = ?").bind(id).run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
