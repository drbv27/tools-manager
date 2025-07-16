// src/hooks/useUsers.ts

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Definimos el tipo de dato para un usuario, tal como lo devuelve nuestra API
export interface ApiUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | undefined;
  imageUrl: string;
  role: "admin" | "employee";
  lastSignInAt: Date | null;
}

// Función de fetching que llama a nuestra nueva API
const fetchUsers = async (): Promise<ApiUser[]> => {
  const { data } = await axios.get("/api/users");
  if (!data.success) {
    throw new Error("No se pudieron obtener los usuarios desde la API.");
  }
  return data.data;
};

// El custom hook que encapsula la lógica de TanStack Query
export function useUsers() {
  return useQuery<ApiUser[], Error>({
    queryKey: ["users"], // Clave única para esta query
    queryFn: fetchUsers, // La función que se ejecutará para obtener los datos
  });
}
