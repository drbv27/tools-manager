// src/components/admin/tools/ToolsTable.tsx
"use client";

import { ITool } from "@/models/Tool";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import DeleteToolDialog from "./DeleteToolDialog";
import EditToolDialog from "./EditToolDialog";
import Image from "next/image";

interface ToolsTableProps {
  tools: ITool[];
}

export default function ToolsTable({ tools }: ToolsTableProps) {
  return (
    <div className="overflow-x-auto bg-card shadow-md rounded-lg">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted border-b border-border sticky top-0 z-10">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Imagen
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Nombre
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Descripción
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Stock
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {tools.map((tool) => (
            <tr
              key={tool._id as string}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="relative h-10 w-10 shrink-0">
                  <Image
                    src={tool.imageUrl}
                    alt={tool.name}
                    fill
                    className="rounded-full object-cover border"
                    sizes="40px"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-foreground">
                  {tool.name}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-muted-foreground max-w-xs truncate">
                  {tool.description}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-foreground">
                  {tool.stockTotal} Total
                </div>
                <div className="text-xs text-muted-foreground">
                  {tool.stockOnLoan} en préstamo
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <EditToolDialog toolId={tool._id as string} />
                  <DeleteToolDialog
                    toolId={tool._id as string}
                    toolName={tool.name}
                  >
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                    </Button>
                  </DeleteToolDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
