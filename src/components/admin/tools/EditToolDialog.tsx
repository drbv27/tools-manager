// src/components/admin/tools/EditToolDialog.tsx
"use client";

import { useState } from "react";
import { useTool } from "@/hooks/useTools";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditToolForm from "./EditToolForm";
import { Pencil } from "lucide-react";

interface EditToolDialogProps {
  toolId: string;
}

export default function EditToolDialog({ toolId }: EditToolDialogProps) {
  const [open, setOpen] = useState(false);

  const { data: tool, isLoading, isError } = useTool(open ? toolId : null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Herramienta</DialogTitle>
          <DialogDescription>
            Modifica los detalles de la herramienta y haz clic en guardar.
          </DialogDescription>
        </DialogHeader>
        {isLoading && <p>Cargando datos...</p>}
        {isError && (
          <p className="text-destructive">No se pudieron cargar los datos.</p>
        )}
        {tool && (
          <EditToolForm tool={tool} onFormSubmit={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}
