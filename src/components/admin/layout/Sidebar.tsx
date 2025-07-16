// src/components/admin/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wrench,
  LayoutDashboard,
  ListChecks,
  UserCog,
  PanelTopDashed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import NotificationBell from "@/components/common/NotificationBell";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const navLinks = [
    {
      href: "/dashboard",
      label: "Mi Dashboard",
      icon: PanelTopDashed,
      role: "all",
    },
    {
      href: "/admin/dashboard",
      label: "Admin Dashboard",
      icon: LayoutDashboard,
      role: "admin",
    },
    {
      href: "/admin/tools",
      label: "Herramientas",
      icon: Wrench,
      role: "admin",
    },
    {
      href: "/admin/requests",
      label: "Solicitudes",
      icon: ListChecks,
      role: "admin",
    },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-card text-card-foreground border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b shrink-0">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          MiniApp
        </Link>
      </div>
      <nav className="flex-1 space-y-2 p-4">
        {navLinks.map((link) => {
          if (link.role === "all" || (link.role === "admin" && isAdmin)) {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 hover:text-primary-foreground transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          }
          return null;
        })}
      </nav>
      <div className="mt-auto p-4 border-t border-border shrink-0">
        <SignedIn>
          <div className="flex flex-col gap-4">
            <Link
              href="/user-profile"
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                pathname.startsWith("/user-profile")
                  ? "bg-primary text-primary-foreground"
                  : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <UserCog className="h-4 w-4" />
              Mi Perfil
            </Link>
            <div className="flex items-center justify-between gap-4">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col flex-1">
                <p className="text-sm font-semibold text-card-foreground">
                  Mi Cuenta
                </p>
              </div>
              <NotificationBell />
              <ThemeToggle />
            </div>
          </div>
        </SignedIn>
      </div>
    </aside>
  );
}
