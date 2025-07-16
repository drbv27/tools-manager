// src/app/api/requests/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Request from "@/models/Request";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Contar todas las solicitudes del usuario
    const totalRequests = await Request.countDocuments({ user: userId });

    // Contar solicitudes por estado usando el pipeline de agregación de MongoDB
    const stats = await Request.aggregate([
      { $match: { user: userId } }, // Filtra por el usuario actual
      {
        $group: {
          _id: "$status", // Agrupa por el campo 'status'
          count: { $sum: 1 }, // Cuenta los documentos en cada grupo
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

    // Formatear los resultados para un fácil acceso (ej. { "pendiente": 5, "aprobada": 3 })
    const formattedStats: { [key: string]: number } = {
      total: totalRequests,
      pendiente: 0,
      aprobada: 0,
      rechazada: 0,
      devuelta: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat.status] = stat.count;
    });

    return NextResponse.json({ success: true, data: formattedStats });
  } catch (error) {
    console.error("Error al obtener estadísticas de solicitudes:", error);
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
