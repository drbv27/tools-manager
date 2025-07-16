// src/components/dashboard/CreateRequestDialog.tsx
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
import { PlusCircle } from "lucide-react";
import { RequestForm } from "./RequestForm";

export function CreateRequestDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2" />
          Crear Nueva Solicitud
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Solicitar Herramienta</DialogTitle>
          <DialogDescription>
            Selecciona una herramienta disponible y justifica tu solicitud.
          </DialogDescription>
        </DialogHeader>
        <RequestForm onFormSubmit={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
