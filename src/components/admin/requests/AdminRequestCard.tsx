// src/components/admin/requests/AdminRequestCard.tsx
"use client";

import {
  AdminPopulatedRequest,
  useUpdateStatusRequest,
} from "@/hooks/useRequests";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cva } from "class-variance-authority";
import { Check, X, Undo2 } from "lucide-react";
import Image from "next/image";

interface AdminRequestCardProps {
  request: AdminPopulatedRequest;
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

export default function AdminRequestCard({ request }: AdminRequestCardProps) {
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

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <div className="relative w-16 h-16 shrink-0">
          <Image
            src={request.user.imageUrl || "/default-avatar.png"}
            alt={request.user.firstName || "Usuario"}
            fill
            className="rounded-full object-cover border"
            sizes="64px"
          />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">
            {request.user.firstName} {request.user.lastName}
          </CardTitle>
          <p className="text-sm text-muted-foreground break-all">
            {request.user.id}
          </p>
        </div>
        <Badge className={badgeVariants({ status: request.status })}>
          {request.status}
        </Badge>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Separator className="mb-4" />
        <div className="flex items-center gap-3 mb-2">
          <div className="relative h-12 w-12 shrink-0">
            <Image
              src={request.tool.imageUrl}
              alt={request.tool.name}
              fill
              className="rounded-full object-cover border"
              sizes="48px"
            />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base">{request.tool.name}</p>
            <p className="text-sm text-muted-foreground">
              Solicitada el:{" "}
              {new Date(request.createdAt).toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-semibold">Justificación:</span>
          {request.justification}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        {request.status === "pendiente" && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleApprove(request._id as string)}
              disabled={isPending}
            >
              <Check className="mr-2 h-4 w-4" /> Aprobar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleReject(request._id as string)}
              disabled={isPending}
            >
              <X className="mr-2 h-4 w-4" /> Rechazar
            </Button>
          </>
        )}
        {request.status === "aprobada" && (
          <Button
            variant="default"
            size="sm"
            onClick={() => handleReturn(request._id as string)}
            disabled={isPending}
          >
            <Undo2 className="mr-2 h-4 w-4" /> Devolver
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
