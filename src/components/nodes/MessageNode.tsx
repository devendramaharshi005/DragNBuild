import React from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import { MessageSquare } from "lucide-react";

const MessageNode = ({ data, selected }: NodeProps) => {
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`rounded-lg shadow-md border ${
        selected ? "border-blue-500 border-2" : "border-gray-200"
      } bg-white min-w-[200px]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-green-100 rounded-t-lg px-3 py-2">
        <span className="text-sm font-semibold text-gray-800">
          Send Message
        </span>
        <MessageSquare className="text-green-600 w-4 h-4" />
      </div>

      {/* Body */}
      <div className="px-3 py-3 text-sm text-gray-800">
        {data.label || "Message..."}
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </div>
  );
};

export default MessageNode;
