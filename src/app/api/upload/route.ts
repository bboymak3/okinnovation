import { NextResponse } from "next/server";

export const runtime = "edge";

// Cloudflare Pages doesn't have a writable filesystem.
// We convert uploaded images to base64 data URLs that are stored in the product's image field.
// Max file size: 1MB (becomes ~1.33MB as base64, within D1 limits).

const MAX_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No se subio archivo" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Tipo de archivo no soportado. Use JPG, PNG, WebP o GIF" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Archivo demasiado grande. Maximo 1MB" },
        { status: 400 }
      );
    }

    // Convert to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      message: "Imagen convertida correctamente",
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error al procesar imagen" },
      { status: 500 }
    );
  }
}
