// src/app/api/notifications/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Notification from "@/models/Notification";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    const notifications = await Notification.find({ user: userId, read: false })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({ success: true, data: notifications });
  } catch (error: unknown) {
    console.error("Error al obtener notificaciones:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
