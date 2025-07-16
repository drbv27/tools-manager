// src/hooks/useNotifications.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { INotification } from "@/models/Notification";

// Función para obtener las notificaciones no leídas del usuario actual
const fetchNotifications = async (): Promise<INotification[]> => {
  const { data } = await axios.get("/api/notifications");
  if (!data.success) {
    throw new Error("No se pudieron obtener las notificaciones.");
  }
  return data.data;
};

// Función para marcar una notificación como leída
const markNotificationAsRead = async (
  notificationId: string
): Promise<INotification> => {
  const { data } = await axios.put(`/api/notifications/${notificationId}`, {
    read: true,
  });
  return data.data;
};

// Hook para obtener notificaciones con polling
export function useGetNotifications() {
  return useQuery<INotification[], Error>({
    queryKey: ["notifications"], // Clave única para las notificaciones
    queryFn: fetchNotifications,
    refetchInterval: 30000, // Polling cada 30 segundos (30000 ms)
    refetchOnWindowFocus: true, // Refetch cuando la ventana vuelve a estar en foco
    staleTime: 20000, // Datos considerados "stale" (obsoletos) después de 20 segundos
  });
}

// Hook para marcar una notificación como leída
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  return useMutation<INotification, Error, string>({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      // Invalidar la query de notificaciones para que se refetch
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(`Error al marcar notificación como leída: ${error.message}`);
    },
  });
}
