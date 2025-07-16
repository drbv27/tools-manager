"use client";

import { useState } from "react";
import { useGetAllRequests } from "@/hooks/useRequests";
import AdminRequestsTable from "@/components/admin/requests/AdminRequestsTable";
import AdminRequestCard from "@/components/admin/requests/AdminRequestCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ListChecks,
  Search,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

/**
 * Defines the possible request statuses for filtering.
 */
type RequestStatus =
  | "pendiente"
  | "aprobada"
  | "rechazada"
  | "devuelta"
  | "all";

/**
 * AdminRequestsPage component for managing and displaying requests.
 * Provides filtering by status, search functionality, and pagination.
 */
export default function AdminRequestsPage() {
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading, isError, error, isFetching } = useGetAllRequests(
    selectedStatus,
    currentPage,
    itemsPerPage,
    debouncedSearchTerm
  );

  const requests = data?.data || [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages || 1;

  /**
   * Handles changes in the selected request status filter.
   * Resets pagination to the first page.
   * @param value The new status value.
   */
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value as RequestStatus);
    setCurrentPage(1);
  };

  /**
   * Handles changes in the number of items displayed per page.
   * Resets pagination to the first page.
   * @param value The new items per page value.
   */
  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  /**
   * Renders skeleton loaders during the initial loading phase.
   */
  if (isLoading && !isFetching) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[150px]" />
            <Skeleton className="h-10 w-[70px]" />
          </div>
        </div>
        <div className="hidden md:block bg-card shadow-md rounded-lg p-4">
          <Skeleton className="h-12 w-full mb-4" />
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center space-x-4 py-4 border-b last:border-b-0"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-1/5" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
              <Skeleton className="h-4 w-1/12 ml-auto" />
            </div>
          ))}
        </div>

        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
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
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Page header and filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 shrink-0">
        <h1 className="text-3xl font-bold">Gestión de Solicitudes</h1>
        <div className="flex flex-wrap items-center gap-4">
          {/* Status filter dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="status-filter"
              className="text-sm font-medium text-muted-foreground"
            >
              Estado:
            </label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger id="status-filter" className="w-[150px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobada">Aprobada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
                <SelectItem value="devuelta">Devuelta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items per page selector */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="items-per-page"
              className="text-sm font-medium text-muted-foreground"
            >
              Mostrar:
            </label>
            <Select
              value={String(itemsPerPage)}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger id="items-per-page" className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search input with debounce and loading indicator */}
      <div className="flex items-center gap-2 mb-6">
        <Search className="h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar solicitud por justificación o nombre de herramienta..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {isFetching && (
          <Loader2 className="h-5 w-5 animate-spin text-primary ml-2" />
        )}
      </div>

      {/* Error message display */}
      {isError && (
        <p className="text-destructive text-center p-4">
          Error: {error.message}
        </p>
      )}

      {/* Main content area for requests, handles empty state and responsive views */}
      <div className="flex-1 overflow-hidden">
        {!isLoading && !isFetching && requests.length === 0 ? (
          /* Empty state component when no requests are found */
          <EmptyState
            icon={ListChecks}
            title={
              searchTerm
                ? "No se encontraron solicitudes."
                : "No hay solicitudes para mostrar."
            }
            description={
              searchTerm
                ? "Intenta ajustar tu búsqueda."
                : "Crea nuevas solicitudes o ajusta tus filtros."
            }
          />
        ) : (
          requests.length > 0 && (
            <>
              {/* Mobile view: Renders requests as cards */}
              <div className="md:hidden space-y-4 h-full overflow-y-auto pb-4">
                {requests.map((request) => (
                  <AdminRequestCard
                    key={request._id as string}
                    request={request}
                  />
                ))}
              </div>

              {/* Desktop view: Renders requests in a table */}
              <div className="hidden md:block h-full">
                <AdminRequestsTable requests={requests} />
              </div>
            </>
          )
        )}
      </div>

      {/* Pagination controls */}
      {requests.length > 0 && (
        <div className="flex items-center justify-between p-4 mt-4 border-t border-border bg-card rounded-b-lg shrink-0">
          <p className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isFetching}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Página anterior</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || isFetching}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Página siguiente</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
