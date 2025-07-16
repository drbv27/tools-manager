// src/app/api/tools/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tool from "@/models/Tool";
import mongoose from "mongoose";

// === MANEJADOR GET: OBTENER TODAS LAS HERRAMIENTAS (con filtro de búsqueda) ===
export async function GET(request: NextRequest) {
  try {
    // 1. Conectarnos a la base de datos
    await dbConnect();

    // 2. Obtener el parámetro de consulta 'search'
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    // 3. Construir el objeto de consulta para MongoDB
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {}; // Corrección: Añadir el comentario para deshabilitar la regla

    if (searchTerm) {
      // Si hay un término de búsqueda, usamos $or para buscar en nombre o descripción
      query.$or = [
        { name: { $regex: searchTerm, $options: "i" } }, // Búsqueda insensible a mayúsculas/minúsculas
        { description: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // 4. Buscar todas las herramientas en la colección que coincidan con la query
    const tools = await Tool.find(query).sort({ createdAt: -1 }); // Ordenar por las más recientes primero

    // 5. Responder con las herramientas encontradas
    return NextResponse.json({ success: true, data: tools }, { status: 200 });
  } catch (error: unknown) {
    // Corrección: Cambiar 'any' a 'unknown'
    console.error("Error al obtener las herramientas con búsqueda:", error);
    // En caso de un error en el servidor, responder con un mensaje de error
    return NextResponse.json(
      {
        success: false,
        error: "Error del servidor al obtener las herramientas",
      },
      { status: 500 }
    );
  }
}

// === MANEJADOR POST: CREAR UNA NUEVA HERRAMIENTA ===
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    const tool = await Tool.create(body);
    return NextResponse.json({ success: true, data: tool }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((val) => val.message);
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error del servidor al crear la herramienta" },
      { status: 500 }
    );
  }
}
