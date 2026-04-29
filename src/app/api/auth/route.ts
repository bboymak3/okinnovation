import { NextResponse } from "next/server";

// Simple password-based auth (stored as env variable, with a default for demo)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "okinnovation2024";

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Password requerida" },
        { status: 400 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
      return NextResponse.json({
        success: true,
        token,
        message: "Login exitoso",
      });
    }

    return NextResponse.json(
      { error: "Contrasena incorrecta" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
