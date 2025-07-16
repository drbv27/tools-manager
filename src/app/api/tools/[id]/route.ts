// src/app/api/tools/[id]/route.ts

import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Tool from "@/models/Tool";
import mongoose from "mongoose";

interface Params {
  id: string;
}

// === MANEJADOR GET: OBTENER UNA HERRAMIENTA POR SU ID ===
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();
    const tool = await Tool.findById(params.id);

    if (!tool) {
      return NextResponse.json(
        { success: false, error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: tool }, { status: 200 });
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}

// === MANEJADOR PUT: ACTUALIZAR UNA HERRAMIENTA POR SU ID ===
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();
    const body = await request.json();

    const updatedTool = await Tool.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTool) {
      return NextResponse.json(
        { success: false, error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedTool },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const messages = Object.values(error.errors).map(
        (val: any) => val.message
      );
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextResponse.json(
      {
        success: false,
        error: "Error del servidor al actualizar la herramienta",
      },
      { status: 500 }
    );
  }
}

// === MANEJADOR DELETE: ELIMINAR UNA HERRAMIENTA POR SU ID ===
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await dbConnect();

    const deletedTool = await Tool.findByIdAndDelete(params.id);

    if (!deletedTool) {
      return NextResponse.json(
        { success: false, error: "Herramienta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} }, { status: 200 });
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return NextResponse.json(
      {
        success: false,
        error: "Error del servidor al eliminar la herramienta",
      },
      { status: 500 }
    );
  }
}
