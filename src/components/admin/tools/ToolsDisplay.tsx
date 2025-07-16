// src/components/admin/tools/ToolsDisplay.tsx
"use client";

import { ITool } from "@/models/Tool";
import ToolCard from "./ToolCard";
import ToolsTable from "./ToolsTable";

interface ToolsDisplayProps {
  tools: ITool[];
}

export default function ToolsDisplay({ tools }: ToolsDisplayProps) {
  return (
    <div>
      <div className="md:hidden">
        {tools.map((tool) => (
          <ToolCard key={tool._id as string} tool={tool} />
        ))}
      </div>
      <div className="hidden md:block">
        <ToolsTable tools={tools} />
      </div>
    </div>
  );
}
