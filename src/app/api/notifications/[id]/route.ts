// src/app/api/notifications/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";

interface Params {
  id: string; // ID de la notificación
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  const { userId } = await auth(); // Obtener el ID del usuario autenticado
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const notificationId = params.id;

    // Buscamos la notificación y la actualizamos a 'leída'
    // Nos aseguramos de que solo el usuario propietario pueda marcarla como leída
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId, read: false }, // Buscar por ID y por usuario Y que no esté ya leída
      { read: true },
      { new: true } // Devolver el documento actualizado
    );

    if (!updatedNotification) {
      // Si no se encuentra o el usuario no es el propietario, o ya está leída
      return NextResponse.json(
        {
          success: false,
          error: "Notificación no encontrada o no autorizada.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedNotification });
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
