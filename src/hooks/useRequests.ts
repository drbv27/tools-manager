// src/hooks/useRequests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { queryOptions } from "@tanstack/react-query"; // <-- CAMBIO: Deshabilitar no-unused-vars
import axios from "axios";
import { toast } from "sonner";
import { IRequest } from "@/models/Request";
import { ITool } from "@/models/Tool";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { INotification } from "@/models/Notification"; // <-- CAMBIO: Deshabilitar no-unused-vars

// 1. Definimos la forma de los datos que el formulario enviará a la mutación
interface CreateRequestData {
  tool: string;
  justification: string;
}

// Interfaz para solicitudes populadas con la herramienta completa
export interface PopulatedRequest extends Omit<IRequest, "tool"> {
  tool: ITool;
  user: string;
}

// Interfaz para solicitudes populadas con la herramienta Y el usuario completo (para admin)
export interface AdminPopulatedRequest extends Omit<IRequest, "tool" | "user"> {
  tool: ITool;
  user: {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    imageUrl?: string;
  };
}

// Interfaz para los datos que enviaremos al actualizar una solicitud
interface UpdateRequestData {
  requestId: string;
  status: "aprobada" | "rechazada" | "devuelta";
}

// Interfaz para la respuesta de paginación
interface PaginationData {
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
}

// Interfaz para las estadísticas de solicitudes
interface RequestStats {
  total: number;
  pendiente: number;
  aprobada: number;
  rechazada: number;
  devuelta: number;
}

// Funciones de fetching/mutación
const fetchMyRequests = async (): Promise<PopulatedRequest[]> => {
  const { data } = await axios.get("/api/requests");
  if (!data.success) {
    throw new Error("No se pudieron obtener las solicitudes.");
  }
  return data.data;
};

const addRequest = async (
  newRequestData: CreateRequestData
): Promise<IRequest> => {
  const { data } = await axios.post("/api/requests", newRequestData);
  return data.data;
};

const updateRequestStatus = async ({
  requestId,
  status,
}: UpdateRequestData): Promise<IRequest> => {
  const { data } = await axios.put(`/api/admin/requests/${requestId}`, {
    status,
  });
  return data.data;
};

const fetchAllRequests = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  searchTerm?: string
): Promise<{ data: AdminPopulatedRequest[]; pagination: PaginationData }> => {
  let url = `/api/admin/requests?page=${page}&limit=${limit}`;
  if (status && status !== "all") {
    url += `&status=${status}`;
  }
  if (searchTerm) {
    url += `&search=${encodeURIComponent(searchTerm)}`;
  }
  const { data } = await axios.get(url);
  if (!data.success) {
    throw new Error("No se pudieron obtener todas las solicitudes.");
  }
  return data;
};

const fetchRequestStats = async (): Promise<RequestStats> => {
  const { data } = await axios.get("/api/requests/stats");
  if (!data.success) {
    throw new Error("No se pudieron obtener las estadísticas de solicitudes.");
  }
  return data.data;
};

// Custom Hooks
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation<IRequest, Error, CreateRequestData>({
    mutationFn: addRequest,
    onSuccess: (data) => {
      toast.success("Solicitud enviada con éxito.");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error) => {
      toast.error(`Error al enviar la solicitud: ${error.message}`);
    },
  });
}

export function useGetMyRequests() {
  return useQuery<PopulatedRequest[], Error>({
    queryKey: ["requests"],
    queryFn: fetchMyRequests,
  });
}

export function useGetAllRequests(
  statusFilter?: "pendiente" | "aprobada" | "rechazada" | "devuelta" | "all",
  page: number = 1,
  limit: number = 10,
  searchTerm?: string
) {
  return useQuery<
    { data: AdminPopulatedRequest[]; pagination: PaginationData },
    Error
  >({
    queryKey: ["admin-requests", statusFilter, page, limit, searchTerm],
    queryFn: () => fetchAllRequests(statusFilter, page, limit, searchTerm),
    placeholderData: (previousData) => previousData,
  });
}

export function useUpdateStatusRequest() {
  const queryClient = useQueryClient();
  return useMutation<IRequest, Error, UpdateRequestData>({
    mutationFn: updateRequestStatus,
    onSuccess: (data) => {
      toast.success(`Solicitud ${data.status} con éxito.`);
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error) => {
      toast.error(`Error al actualizar solicitud: ${error.message}`);
    },
  });
}

export function useGetRequestStats() {
  return useQuery<RequestStats, Error>({
    queryKey: ["request-stats"],
    queryFn: fetchRequestStats,
    refetchInterval: 60000,
  });
}
