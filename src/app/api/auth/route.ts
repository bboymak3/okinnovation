import { NextResponse } from "next/server";

export const runtime = "edge";

// Simple password-based auth
const ADMIN_PASSWORD = "okinnovation2024";

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
      const token = btoa(`admin:${Date.now()}`);
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
