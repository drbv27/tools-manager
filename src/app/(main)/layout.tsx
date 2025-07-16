// src/app/(main)/layout.tsx

import Sidebar from "@/components/admin/layout/Sidebar";
import MobileSidebar from "@/components/admin/layout/MobileSidebar";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-y-auto">
        <header className="flex items-center justify-between md:hidden h-16 px-4 border-b border-border bg-card shrink-0">
          <Link
            href="/admin/dashboard"
            className="text-xl font-bold text-primary"
          >
            Admin
          </Link>
          <MobileSidebar />
        </header>
        <main className="flex-1 p-4 sm:p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
