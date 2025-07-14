"use client";

import type React from "react";
import { LucideMessageCircle, MessageCircle, MessageCircleIcon, MessageSquare } from "lucide-react";

const nodeTemplates = [
  {
    type: "message",
    label: "Message",
    icon: MessageCircleIcon,
    color: "bg-white border-blue-300 text-blue-700",
    description: "Start message",
  },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Node Templates
      </h2>

      <div className="space-y-3">
        {nodeTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <div
              key={template.type}
              className={`p-3 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing transition-all hover:shadow-md ${template.color}`}
              draggable
              onDragStart={(event) => onDragStart(event, template.type)}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <div>
                  <div className="font-medium">{template.label}</div>
                  <div className="text-xs opacity-75">
                    {template.description}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-3 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">How to use</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Drag nodes to canvas</li>
          <li>• Connect nodes with handles</li>
          <li>• Click nodes to configure</li>
          <li>• Use toolbar to test flow</li>
        </ul>
      </div>
    </div>
  );
}
