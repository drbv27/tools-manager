// src/app/api/admin/dashboard-stats/route.ts
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";
import Tool from "@/models/Tool";

export async function GET() {
  try {
    const { userId, sessionClaims } = await auth();

    // Verificación de autorización para admin
    const userRole = (sessionClaims?.metadata as { role?: string } | undefined)
      ?.role;

    if (userId === null || userRole !== "admin") {
      return NextResponse.json(
        { success: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    await dbConnect();

    // Estadísticas de Solicitudes Globales
    const totalRequests = await Request.countDocuments({});
    const requestsByStatus = await Request.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    const formattedRequestStats: { [key: string]: number } = {
      total: totalRequests,
      pendiente: 0,
      aprobada: 0,
      rechazada: 0,
      devuelta: 0,
    };
    requestsByStatus.forEach((stat) => {
      formattedRequestStats[stat.status] = stat.count;
    });

    // Estadísticas de Herramientas
    const totalTools = await Tool.countDocuments({});
    const toolsOnLoan = await Tool.aggregate([
      { $match: { stockOnLoan: { $gt: 0 } } }, // Herramientas con al menos una unidad prestada
      { $group: { _id: null, totalOnLoan: { $sum: "$stockOnLoan" } } },
      { $project: { _id: 0, totalOnLoan: 1 } },
    ]);
    const totalStockOnLoan =
      toolsOnLoan.length > 0 ? toolsOnLoan[0].totalOnLoan : 0;

    // Contar el número de herramientas que tienen stock disponible (total > en_prestamo)
    const availableToolsCount = await Tool.countDocuments({
      $expr: { $gt: ["$stockTotal", "$stockOnLoan"] }, // Condición para stockTotal > stockOnLoan
    });

    // Estadísticas de Usuarios (solo admins y empleados de Clerk)
    const clerk = await clerkClient();
    const allClerkUsersResponse = await clerk.users.getUserList(); // Obtener todos los usuarios de Clerk
    const allClerkUsers = allClerkUsersResponse.data;

    let totalClerkUsers = 0;
    let totalAdmins = 0;
    let totalEmployees = 0;

    for (const clerkUser of allClerkUsers) {
      totalClerkUsers++;
      const userPublicMetadata = clerkUser.publicMetadata as { role?: string };
      if (userPublicMetadata?.role === "admin") {
        totalAdmins++;
      } else {
        totalEmployees++;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        requests: formattedRequestStats,
        tools: {
          totalTools: totalTools,
          totalOnLoan: totalStockOnLoan,
          availableTools: availableToolsCount, // Herramientas con stock disponible
        },
        users: {
          totalClerkUsers: totalClerkUsers,
          totalAdmins: totalAdmins,
          totalEmployees: totalEmployees,
        },
      },
    });
  } catch (error) {
    console.error(
      "Error al obtener estadísticas del dashboard de admin:",
      error
    );
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
