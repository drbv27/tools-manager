// src/app/api/admin/requests/route.ts

import { NextResponse, type NextRequest } from "next/server";
import { auth, clerkClient, type User } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Request, { IRequest } from "@/models/Request";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Tool from "@/models/Tool";
import { PipelineStage } from "mongoose";

interface AggregatedRequestResult extends IRequest {
  toolInfo: {
    _id: string;
    name: string;
    description: string;
    imageUrl: string;
    stockTotal: number;
    stockOnLoan: number;
  };
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");
    const searchTerm = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    if (
      statusFilter &&
      ["pendiente", "aprobada", "rechazada", "devuelta"].includes(statusFilter)
    ) {
      query.status = statusFilter as
        | "pendiente"
        | "aprobada"
        | "rechazada"
        | "devuelta";
    }

    if (searchTerm) {
      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: "tools",
            localField: "tool",
            foreignField: "_id",
            as: "toolInfo",
          },
        },
        { $unwind: "$toolInfo" },
        {
          $match: {
            $and: [
              query,
              {
                $or: [
                  { justification: { $regex: searchTerm, $options: "i" } },
                  { "toolInfo.name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
      ];

      const totalRequestsResult = await Request.aggregate([
        {
          $lookup: {
            from: "tools",
            localField: "tool",
            foreignField: "_id",
            as: "toolInfo",
          },
        },
        { $unwind: "$toolInfo" },
        {
          $match: {
            $and: [
              query,
              {
                $or: [
                  { justification: { $regex: searchTerm, $options: "i" } },
                  { "toolInfo.name": { $regex: searchTerm, $options: "i" } },
                ],
              },
            ],
          },
        },
        { $count: "total" },
      ]);

      const totalRequests =
        totalRequestsResult.length > 0 ? totalRequestsResult[0].total : 0;
      const requestsFromDb: AggregatedRequestResult[] = await Request.aggregate(
        pipeline
      );

      const clerk = await clerkClient();

      const populatedRequestsPromises = requestsFromDb.map(
        async (req: AggregatedRequestResult) => {
          const clerkUser: User | null = await clerk.users.getUser(req.user);
          const tool = req.toolInfo;

          return {
            ...req,
            tool: {
              _id: tool._id,
              name: tool.name,
              description: tool.description,
              imageUrl: tool.imageUrl,
              stockTotal: tool.stockTotal,
              stockOnLoan: tool.stockOnLoan,
            },
            user: {
              id: clerkUser?.id,
              firstName: clerkUser?.firstName,
              lastName: clerkUser?.lastName,
              imageUrl: clerkUser?.imageUrl,
            },
          };
        }
      );
      const populatedRequests = await Promise.all(populatedRequestsPromises);

      return NextResponse.json({
        success: true,
        data: populatedRequests,
        pagination: {
          totalItems: totalRequests,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalRequests / limit),
        },
      });
    } else {
      const totalRequests = await Request.countDocuments(query);
      const skip = (page - 1) * limit;

      const allRequests: IRequest[] = await Request.find(query)
        .populate("tool")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const userIds = Array.from(new Set(allRequests.map((req) => req.user)));
      const clerk = await clerkClient();

      const userListResponse = await clerk.users.getUserList({
        userId: userIds,
      });
      const users: User[] = userListResponse.data;
      const userMap = new Map(users.map((user) => [user.id, user]));

      const populatedRequests = allRequests.map((req) => {
        const user = userMap.get(req.user);
        return {
          ...req.toObject(),
          user: {
            id: user?.id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            imageUrl: user?.imageUrl,
          },
        };
      });

      return NextResponse.json({
        success: true,
        data: populatedRequests,
        pagination: {
          totalItems: totalRequests,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalRequests / limit),
        },
      });
    }
  } catch (error: unknown) {
    console.error(
      "Error al obtener todas las solicitudes (con/sin búsqueda):",
      error
    );
    return NextResponse.json(
      { success: false, error: "Error del servidor" },
      { status: 500 }
    );
  }
}
