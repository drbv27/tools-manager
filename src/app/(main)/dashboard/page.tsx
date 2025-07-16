// src/app/(main)/dashboard/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import { CreateRequestDialog } from "@/components/dashboard/CreateRequestDialog";
import { RequestsList } from "@/components/dashboard/RequestsList";
import { useGetMyRequests, useGetRequestStats } from "@/hooks/useRequests";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Hourglass,
  CheckCircle,
  XCircle,
  RefreshCcw,
  ListChecks,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";

export default function DashboardPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const {
    data: requests,
    isLoading: requestsLoading,
    isError: requestsError,
  } = useGetMyRequests();
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useGetRequestStats();

  if (!userLoaded || requestsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={`skeleton-card-${i}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  const statsCards = [
    {
      title: "Total Solicitudes",
      value: stats?.total,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Pendientes",
      value: stats?.pendiente,
      icon: Hourglass,
      color: "text-yellow-500",
    },
    {
      title: "Aprobadas",
      value: stats?.aprobada,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Devueltas",
      value: stats?.devuelta,
      icon: RefreshCcw,
      color: "text-blue-500",
    },
    {
      title: "Rechazadas",
      value: stats?.rechazada,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  // Renderizar condicionalmente los estados de la lista de solicitudes
  let requestsContent;

  if (requestsError) {
    requestsContent = (
      <p className="text-destructive text-center p-4">
        Error al cargar tus solicitudes.
      </p>
    );
  } else if (!requestsLoading && requests && requests.length === 0) {
    requestsContent = (
      <EmptyState
        icon={ListChecks}
        title="Aún no has realizado ninguna solicitud."
        description="Haz clic en 'Crear Nueva Solicitud' para empezar a gestionar tus herramientas."
        action={<CreateRequestDialog />}
      />
    );
  } else {
    // Si no hay errores, no está cargando y hay requests (o es undefined y se convierte a []), renderizar la lista
    requestsContent = (
      <RequestsList
        requests={requests || []} // Aseguramos que sea un array
        isLoading={requestsLoading}
        isError={requestsError}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Bienvenido, {user?.firstName || "Usuario"}
        </h1>
        <CreateRequestDialog />
      </div>
      <p className="text-muted-foreground mb-8">
        Desde aquí puedes solicitar herramientas y ver el estado de tus
        solicitudes.
      </p>

      <h2 className="text-2xl font-semibold mb-4 mt-8">
        Resumen de mis Solicitudes
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {statsCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon && <card.icon className={`h-5 w-5 ${card.color}`} />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {requestsContent}
    </div>
  );
}
