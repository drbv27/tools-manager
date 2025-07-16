// src/hooks/useTools.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ITool } from "@/models/Tool";

// ============================================================================
// TIPOS Y DEFINICIONES
// ============================================================================
// Define la forma de los datos que el formulario enviará
export interface ToolFormData {
  name: string;
  description: string;
  imageUrl: string;
  stockTotal: number;
}

// Para la función de actualizar, necesitamos también el ID
interface UpdateToolData extends ToolFormData {
  _id: string;
}

// ============================================================================
// FUNCIONES DE FETCHING (Llamadas a la API)
// ============================================================================

// Obtener todas las herramientas (con filtro de búsqueda)
const fetchTools = async (searchTerm?: string): Promise<ITool[]> => {
  let url = "/api/tools";
  if (searchTerm) {
    url += `?search=${encodeURIComponent(searchTerm)}`;
  }
  const { data } = await axios.get(url);
  return data.data;
};

// Añadir una nueva herramienta
const addTool = async (newTool: ToolFormData): Promise<ITool> => {
  const { data } = await axios.post("/api/tools", newTool);
  return data.data;
};

// Eliminar una herramienta
const deleteTool = async (toolId: string): Promise<void> => {
  await axios.delete(`/api/tools/${toolId}`);
};

// Actualizar una herramienta
const updateTool = async (toolData: UpdateToolData): Promise<ITool> => {
  const { data } = await axios.put(`/api/tools/${toolData._id}`, toolData);
  return data.data;
};

// Obtener una sola herramienta por su ID
const fetchToolById = async (toolId: string): Promise<ITool> => {
  const { data } = await axios.get(`/api/tools/${toolId}`);
  return data.data;
};

// ============================================================================
// CUSTOM HOOKS (Lógica de TanStack Query)
// ============================================================================

// Hook para obtener todas las herramientas (con parámetro de búsqueda)
export function useTools(searchTerm?: string) {
  // Acepta searchTerm
  return useQuery<ITool[], Error>({
    queryKey: ["tools", searchTerm], // La clave de la query debe incluir el término de búsqueda
    queryFn: () => fetchTools(searchTerm), // Pasar el searchTerm al fetcher
    placeholderData: (previousData) => previousData, // Mantener datos previos
  });
}

// Hook para añadir una herramienta
export function useAddTool() {
  const queryClient = useQueryClient();
  return useMutation<ITool, Error, ToolFormData>({
    mutationFn: addTool,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      console.log(`Herramienta "${data.name}" añadida con éxito.`);
    },
    onError: (error) => {
      console.error(`Error al añadir herramienta: ${error.message}`);
    },
  });
}

// Hook para eliminar una herramienta
export function useDeleteTool() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteTool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      toast.success("Herramienta eliminada con éxito.");
    },
    onError: (error) => {
      toast.error(`Error al eliminar: ${error.message}`);
    },
  });
}

// Hook para actualizar una herramienta
export function useUpdateTool() {
  const queryClient = useQueryClient();
  return useMutation<ITool, Error, UpdateToolData>({
    mutationFn: updateTool,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["tool", data._id] });
      toast.success(`Herramienta "${data.name}" actualizada con éxito.`);
    },
    onError: (error) => {
      toast.error(`Error al actualizar: ${error.message}`);
    },
  });
}

// Hook para obtener los datos de UNA SOLA herramienta
export function useTool(toolId: string | null) {
  return useQuery<ITool, Error>({
    queryKey: ["tool", toolId],
    queryFn: () => fetchToolById(toolId!),
    enabled: !!toolId,
  });
}
