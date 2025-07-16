// src/components/admin/tools/ToolCard.tsx
"use client";

import { ITool } from "@/models/Tool";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import DeleteToolDialog from "./DeleteToolDialog";
import EditToolDialog from "./EditToolDialog";
import Image from "next/image";

interface ToolCardProps {
  tool: ITool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const stockDisponible = tool.stockTotal - tool.stockOnLoan;
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        <div className="relative w-20 h-20 shrink-0">
          <Image
            src={tool.imageUrl}
            alt={tool.name}
            fill
            className="rounded-md object-cover border"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex-1">
          <CardTitle>{tool.name}</CardTitle>
          <p className="text-sm text-muted-foreground pt-1">
            {tool.description.substring(0, 100)}...
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <Separator className="mb-4" />
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Stock Total:</span>
          <span className="font-medium">{tool.stockTotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">En Préstamo:</span>
          <span className="font-medium">{tool.stockOnLoan}</span>
        </div>
        <div className="flex justify-between text-sm font-bold text-primary">
          <span className="">Disponibles:</span>
          <span className="">{stockDisponible}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <EditToolDialog toolId={tool._id as string} />
        <DeleteToolDialog toolId={tool._id as string} toolName={tool.name}>
          <Button variant="destructive" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
          </Button>
        </DeleteToolDialog>
      </CardFooter>
    </Card>
  );
}
