// src/app/api/admin/requests/[id]/route.ts
import { NextResponse, type NextRequest } from "next/server";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { auth, clerkClient, type User } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import Tool from "@/models/Tool";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

interface Params {
  id: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { userId, sessionClaims } = await auth();

    const userRole = (sessionClaims?.metadata as { role?: string } | undefined)
      ?.role;

    if (userId === null || userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    await dbConnect();

    const { status } = await request.json();

    if (!status || !["aprobada", "rechazada", "devuelta"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Estado de solicitud inválido." },
        { status: 400 }
      );
    }

    const requestId = params.id;
    let updatedRequest;
    let notificationMessage: string = "";
    const notificationLink: string = `/dashboard`;

    const existingRequest = await Request.findById(requestId).populate("tool");

    if (!existingRequest) {
      return NextResponse.json(
        { success: false, error: "Solicitud no encontrada." },
        { status: 404 }
      );
    }

    if (status === "aprobada" && existingRequest.status === "pendiente") {
      updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { status: "aprobada", approvedOrRejectedAt: new Date() },
        { new: true, runValidators: true }
      );

      await Tool.findByIdAndUpdate(existingRequest.tool._id, {
        $inc: { stockOnLoan: 1 },
      });
      notificationMessage = `Tu solicitud de "${
        (existingRequest.tool as { name: string }).name
      }" ha sido APROBADA.`;
    } else if (
      status === "rechazada" &&
      existingRequest.status === "pendiente"
    ) {
      updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { status: "rechazada", approvedOrRejectedAt: new Date() },
        { new: true, runValidators: true }
      );
      notificationMessage = `Tu solicitud de "${
        (existingRequest.tool as { name: string }).name
      }" ha sido RECHAZADA.`;
    } else if (status === "devuelta" && existingRequest.status === "aprobada") {
      updatedRequest = await Request.findByIdAndUpdate(
        requestId,
        { status: "devuelta", returnedAt: new Date() },
        { new: true, runValidators: true }
      );

      await Tool.findByIdAndUpdate(existingRequest.tool._id, {
        $inc: { stockOnLoan: -1 },
      });
      notificationMessage = `Has devuelto la herramienta "${
        (existingRequest.tool as { name: string }).name
      }".`;
    } else {
      return NextResponse.json(
        { success: false, error: "Transición de estado inválida." },
        { status: 400 }
      );
    }

    if (!updatedRequest) {
      return NextResponse.json(
        { success: false, error: "No se pudo actualizar la solicitud." },
        { status: 500 }
      );
    }

    if (notificationMessage) {
      await Notification.create({
        user: existingRequest.user,
        message: notificationMessage,
        link: notificationLink,
      });
    }

    return NextResponse.json(
      { success: true, data: updatedRequest },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error al actualizar la solicitud:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(
        (val) => (val as mongoose.Error.ValidatorError).message
      );
      return NextResponse.json(
        { success: false, error: messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
