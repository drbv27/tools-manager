// src/components/dashboard/RequestsList.tsx
"use client";

import { PopulatedRequest } from "@/hooks/useRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";
import Image from "next/image";

interface RequestsListProps {
  requests: PopulatedRequest[];
  isLoading: boolean;
  isError: boolean;
}

const badgeVariants = cva("capitalize", {
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

export function RequestsList({
  requests,
  isLoading,
  isError,
}: RequestsListProps) {
  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">
        Cargando tus solicitudes...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-center text-destructive">
        Error al cargar las solicitudes.
      </p>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="p-8 border-2 border-dashed border-border rounded-lg text-center text-muted-foreground">
        <p>Aún no has realizado ninguna solicitud.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="md:hidden">
        {requests.map((request) => (
          <Card key={request._id as string} className="mb-4">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{request.tool.name}</CardTitle>
                <Badge className={badgeVariants({ status: request.status })}>
                  {request.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {new Date(request.createdAt).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm">{request.justification}</p>
              {request.tool.imageUrl && (
                <div className="relative h-16 w-16 mt-4 rounded-full overflow-hidden">
                  <Image
                    src={request.tool.imageUrl}
                    alt={request.tool.name}
                    fill
                    className="object-cover border"
                    sizes="64px"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Herramienta</TableHead>
              <TableHead>Justificación</TableHead>
              <TableHead>Fecha de Solicitud</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request._id as string}>
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0">
                    <Image
                      src={request.tool.imageUrl}
                      alt={request.tool.name}
                      fill
                      className="rounded-full object-cover border"
                      sizes="40px"
                    />
                  </div>
                  {request.tool.name}
                </TableCell>
                <TableCell className="max-w-sm truncate">
                  {request.justification}
                </TableCell>
                <TableCell>
                  {new Date(request.createdAt).toLocaleDateString("es-CO")}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={badgeVariants({ status: request.status })}>
                    {request.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
