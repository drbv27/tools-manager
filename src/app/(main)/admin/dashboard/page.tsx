"use client";

import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  Hourglass,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Drill,
  Users,
  ShieldCheck,
  User,
} from "lucide-react";

/**
 * Renders the Admin Dashboard page, displaying various statistics
 * fetched from the API. Includes loading and error states.
 */
export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useAdminDashboardStats();

  /**
   * Displays skeleton loaders while dashboard statistics are being fetched.
   */
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => (
            <Card key={`req-skeleton-${i}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={`tool-skeleton-${i}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-8 w-1/4 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={`user-skeleton-${i}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-5 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-1/3 mb-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  /**
   * Displays an error message if data fetching fails.
   */
  if (isError) {
    return (
      <div className="text-destructive text-center p-8">
        <p>
          Error al cargar el dashboard del administrador. Intenta de nuevo más
          tarde.
        </p>
      </div>
    );
  }

  // Configuration for request statistics cards.
  const requestStatsCards = [
    {
      title: "Total Solicitudes",
      value: stats?.requests.total,
      icon: Package,
      color: "text-primary",
    },
    {
      title: "Pendientes",
      value: stats?.requests.pendiente,
      icon: Hourglass,
      color: "text-yellow-500",
    },
    {
      title: "Aprobadas",
      value: stats?.requests.aprobada,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Devueltas",
      value: stats?.requests.devuelta,
      icon: RefreshCcw,
      color: "text-blue-500",
    },
    {
      title: "Rechazadas",
      value: stats?.requests.rechazada,
      icon: XCircle,
      color: "text-red-600",
    },
  ];

  // Configuration for tool statistics cards.
  const toolStatsCards = [
    {
      title: "Total Herramientas",
      value: stats?.tools.totalTools,
      icon: Drill,
      color: "text-primary",
    },
    {
      title: "En Préstamo",
      value: stats?.tools.totalOnLoan,
      icon: Hourglass,
      color: "text-orange-500",
    },
    {
      title: "Disponibles",
      value: stats?.tools.availableTools,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  // Configuration for user statistics cards.
  const userStatsCards = [
    {
      title: "Total Usuarios",
      value: stats?.users.totalClerkUsers,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Administradores",
      value: stats?.users.totalAdmins,
      icon: ShieldCheck,
      color: "text-purple-500",
    },
    {
      title: "Empleados",
      value: stats?.users.totalEmployees,
      icon: User,
      color: "text-teal-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard de Administrador General</h1>

      {/* Requests statistics section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Resumen de Solicitudes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {requestStatsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
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
      </div>

      {/* Tools statistics section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 mt-6">
          Resumen de Herramientas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolStatsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
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
      </div>

      {/* Users statistics section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 mt-6">
          Resumen de Usuarios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userStatsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
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
      </div>
    </div>
  );
}
