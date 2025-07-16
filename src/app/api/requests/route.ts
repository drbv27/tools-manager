// src/app/api/requests/route.ts

import { NextResponse, type NextRequest } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth, clerkClient, type User } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import Tool from "@/models/Tool";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

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

    const userRequests = await Request.find({ user: userId })
      .populate("tool")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: userRequests });
  } catch (error: unknown) {
    console.error("Error al obtener las solicitudes:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    console.log("Body recibido en la API:", body);
    const { tool, justification } = body;

    if (!tool || !justification) {
      return NextResponse.json(
        { success: false, error: "Faltan los campos 'tool' y 'justification'" },
        { status: 400 }
      );
    }

    await dbConnect();

    const newRequest = await Request.create({
      user: userId,
      tool,
      justification,
    });

    try {
      const clerk = await clerkClient();

      const requestingUser = await clerk.users.getUser(userId);
      const userName =
        requestingUser.firstName || requestingUser.lastName || "Un usuario";

      const requestedTool = await Tool.findById(tool);
      const toolName = requestedTool?.name || "una herramienta";

      const adminUsersResponse = await clerk.users.getUserList();

      const allClerkUsers = adminUsersResponse.data;
      const adminUserIds: string[] = [];

      for (const clerkUser of allClerkUsers) {
        const userPublicMetadata = clerkUser.publicMetadata as {
          role?: string;
        };
        if (userPublicMetadata?.role === "admin") {
          adminUserIds.push(clerkUser.id);
        }
      }

      const notificationPromises = adminUserIds.map((adminId) => {
        return Notification.create({
          user: adminId,
          message: `¡Nueva solicitud! "${userName}" ha solicitado "${toolName}".`,
          link: `/admin/requests`,
        });
      });
      await Promise.all(notificationPromises);
    } catch (notificationError: unknown) {
      console.error(
        "Error al crear notificación para admins:",
        notificationError
      );
    }

    return NextResponse.json(
      { success: true, data: newRequest },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(
        (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
          val.message
      );
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }

    console.error("Error al crear la solicitud:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
