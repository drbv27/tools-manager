"use client";

import { useState } from "react";
import { useTools } from "@/hooks/useTools";
import ToolsDisplay from "@/components/admin/tools/ToolsDisplay";
import { AddToolDialog } from "@/components/admin/tools/AddToolDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { Wrench, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * AdminToolsPage component for managing and displaying tools.
 * Provides search functionality, and handles loading, error, and empty states.
 */
export default function AdminToolsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  // Debounce the search term to reduce API calls while typing.
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: tools,
    isLoading,
    isError,
    error,
  } = useTools(debouncedSearchTerm);

  /**
   * Displays skeleton loaders during the initial loading phase
   * or when no tools data is available yet.
   */
  if (isLoading && !tools) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Skeleton for desktop view */}
        <div className="hidden md:block bg-card shadow-md rounded-lg p-4">
          <Skeleton className="h-12 w-full mb-4" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 py-4 border-b last:border-b-0"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/12 ml-auto" />
            </div>
          ))}
        </div>

        {/* Skeleton for mobile view */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Skeleton className="h-20 w-20 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <Skeleton className="h-3 w-2/3" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Herramientas</h1>
        <AddToolDialog />
      </div>

      {/* Search input with loading spinner */}
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar herramientas por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {isLoading && (
          <Loader2 className="h-5 w-5 animate-spin text-primary ml-2" />
        )}
      </div>

      {/* Error message display */}
      {isError && (
        <p className="text-destructive text-center p-4">
          Error: {error.message}
        </p>
      )}

      {/* Conditional rendering for EmptyState or ToolsDisplay */}
      {!isLoading && !isError && tools && tools.length === 0 ? (
        /* Empty state when no tools are found or inventory is empty */
        <EmptyState
          icon={Wrench}
          title={
            searchTerm
              ? "No se encontraron herramientas."
              : "Aún no hay herramientas en el inventario."
          }
          description={
            searchTerm
              ? "Intenta ajustar tu búsqueda."
              : "Haz clic en 'Añadir Herramienta' para empezar a gestionar."
          }
          action={searchTerm ? null : <AddToolDialog />}
        />
      ) : (
        /* Displays the list of tools if available */
        tools && <ToolsDisplay tools={tools} />
      )}
    </div>
  );
}
