// src/components/admin/requests/AdminRequestsTable.tsx
"use client";

import {
  AdminPopulatedRequest,
  useUpdateStatusRequest,
} from "@/hooks/useRequests";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { Check, X, Undo2 } from "lucide-react";
import Image from "next/image";

interface AdminRequestsTableProps {
  requests: AdminPopulatedRequest[];
}

const badgeVariants = cva("capitalize text-primary-foreground", {
  variants: {
    status: {
      pendiente: "bg-yellow-500 hover:bg-yellow-500/80",
      aprobada: "bg-green-600 hover:bg-green-600/80",
      rechazada: "bg-red-600 hover:bg-red-600/80",
      devuelta: "bg-blue-500 hover:bg-blue-500/80",
    },
  },
  defaultVariants: {
    status: "pendiente",
  },
});

export default function AdminRequestsTable({
  requests,
}: AdminRequestsTableProps) {
  const { mutate: updateRequest, isPending } = useUpdateStatusRequest();

  const handleApprove = (requestId: string) => {
    updateRequest({ requestId, status: "aprobada" });
  };

  const handleReject = (requestId: string) => {
    updateRequest({ requestId, status: "rechazada" });
  };

  const handleReturn = (requestId: string) => {
    updateRequest({ requestId, status: "devuelta" });
  };

  const currentRequestsToDisplay = requests;

  if (currentRequestsToDisplay.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
        <p>
          No hay solicitudes pendientes o aprobadas para gestionar actualmente.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card shadow-md rounded-lg h-full flex flex-col">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted border-b border-border sticky top-0 z-10">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Usuario
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Herramienta
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Justificación
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Fecha
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Estado
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {currentRequestsToDisplay.map((request) => (
              <tr key={request._id as string}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="relative h-8 w-8 shrink-0">
                      <Image
                        src={request.user.imageUrl || "/default-avatar.png"}
                        alt={request.user.firstName || "Usuario"}
                        fill
                        className="rounded-full object-cover border"
                        sizes="32px"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {request.user.firstName} {request.user.lastName}
                      </div>
                      <div className="text-xs text-muted-foreground break-all max-w-[100px] truncate">
                        {request.user.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium flex items-center gap-2">
                    <div className="relative h-8 w-8 shrink-0">
                      <Image
                        src={request.tool.imageUrl}
                        alt={request.tool.name}
                        fill
                        className="rounded-full object-cover border"
                        sizes="32px"
                      />
                    </div>
                    <span className="max-w-[100px] truncate">
                      {request.tool.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-[200px] truncate text-sm text-muted-foreground">
                  {request.justification}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                  {new Date(request.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Badge className={badgeVariants({ status: request.status })}>
                    {request.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex gap-1 justify-end">
                    {request.status === "pendiente" && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleApprove(request._id as string)}
                          title="Aprobar Solicitud"
                          disabled={isPending}
                        >
                          <Check className="h-5 w-5 text-green-600" />
                          <span className="sr-only">Aprobar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleReject(request._id as string)}
                          title="Rechazar Solicitud"
                          disabled={isPending}
                        >
                          <X className="h-5 w-5 text-red-600" />
                          <span className="sr-only">Rechazar</span>
                        </Button>
                      </>
                    )}
                    {request.status === "aprobada" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleReturn(request._id as string)}
                        title="Marcar como Devuelta"
                        disabled={isPending}
                      >
                        <Undo2 className="h-5 w-5 text-blue-600" />
                        <span className="sr-only">Devolver</span>
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
