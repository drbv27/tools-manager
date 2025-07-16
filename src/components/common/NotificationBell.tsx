// src/components/common/NotificationBell.tsx
"use client";

import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  useGetNotifications,
  useMarkNotificationAsRead,
} from "@/hooks/useNotifications";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const router = useRouter();
  const { data: notifications, isLoading, isError } = useGetNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const handleNotificationClick = (notificationId: string, link?: string) => {
    markAsRead(notificationId);
    if (link) {
      router.push(link);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Ver Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-lg">Notificaciones</h3>
          <p className="text-sm text-muted-foreground">
            Tienes {unreadCount} notificación(es) sin leer
          </p>
        </div>

        {isLoading && (
          <p className="p-4 text-center text-muted-foreground">Cargando...</p>
        )}
        {isError && (
          <p className="p-4 text-center text-destructive">
            Error al cargar notificaciones.
          </p>
        )}

        {!isLoading && !isError && notifications?.length === 0 && (
          <p className="p-4 text-center text-muted-foreground">
            No tienes notificaciones.
          </p>
        )}

        {!isLoading &&
          !isError &&
          notifications &&
          notifications.length > 0 && (
            <div className="max-h-60 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification._id as string}
                  onClick={() =>
                    handleNotificationClick(
                      notification._id as string,
                      notification.link
                    )
                  }
                  className="flex flex-col items-start gap-1 p-3 text-left cursor-pointer hover:bg-accent hover:text-accent-foreground"
                >
                  <p className="text-sm font-medium">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString(
                      "es-CO",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }
                    )}{" "}
                    a las{" "}
                    {new Date(notification.createdAt).toLocaleTimeString(
                      "es-CO",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        <Separator />
        <Link
          href="/dashboard"
          className="block text-center text-sm p-2 text-primary hover:underline"
        >
          Ver todas las solicitudes
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
