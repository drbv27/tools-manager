// src/components/admin/tools/AddToolDialog.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ToolForm from "./ToolForm";
import { PlusCircle } from "lucide-react";

export function AddToolDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Herramienta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir Nueva Herramienta</DialogTitle>
          <DialogDescription>
            Rellena los campos para añadir una nueva herramienta al inventario.
          </DialogDescription>
        </DialogHeader>
        <ToolForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
