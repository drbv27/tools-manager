// src/hooks/useAdminDashboardStats.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Definir las interfaces para las estadísticas
interface AdminRequestStats {
  total: number;
  pendiente: number;
  aprobada: number;
  rechazada: number;
  devuelta: number;
}

interface AdminToolStats {
  totalTools: number;
  totalOnLoan: number;
  availableTools: number;
}

interface AdminUserStats {
  totalClerkUsers: number;
  totalAdmins: number;
  totalEmployees: number;
}

export interface AdminDashboardStats {
  requests: AdminRequestStats;
  tools: AdminToolStats;
  users: AdminUserStats;
}

// Función para obtener las estadísticas del dashboard del administrador
const fetchAdminDashboardStats = async (): Promise<AdminDashboardStats> => {
  const { data } = await axios.get("/api/admin/dashboard-stats");
  if (!data.success) {
    throw new Error(
      "No se pudieron obtener las estadísticas del dashboard del administrador."
    );
  }
  return data.data;
};

// Hook para obtener las estadísticas del dashboard del administrador
export function useAdminDashboardStats() {
  return useQuery<AdminDashboardStats, Error>({
    queryKey: ["admin-dashboard-stats"],
    queryFn: fetchAdminDashboardStats,
    refetchInterval: 60000, // Actualizar estadísticas cada minuto
  });
}
