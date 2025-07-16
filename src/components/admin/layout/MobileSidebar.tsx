// src/components/admin/layout/MobileSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Wrench,
  LayoutDashboard,
  ListChecks,
  UserCog,
  PanelTopDashed,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import NotificationBell from "@/components/common/NotificationBell";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export default function MobileSidebar() {
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
          <span className="sr-only">Abrir Menú</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b shrink-0">
          <SheetTitle className="text-2xl font-bold text-primary text-left">
            MiniApp
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
          {navLinks.map((link) => {
            if (link.role === "all" || (link.role === "admin" && isAdmin)) {
              const isActive = pathname.startsWith(link.href);
              return (
                <SheetTrigger asChild key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-base font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                  </Link>
                </SheetTrigger>
              );
            }
            return null;
          })}
        </nav>
        <div className="mt-auto p-4 border-t shrink-0">
          <SignedIn>
            <div className="flex flex-col gap-4">
              <SheetTrigger asChild>
                <Link
                  href="/user-profile"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname.startsWith("/user-profile")
                      ? "bg-primary text-primary-foreground"
                      : "text-card-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <UserCog className="h-5 w-5" />
                  Mi Perfil
                </Link>
              </SheetTrigger>
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
      </SheetContent>
    </Sheet>
  );
}
