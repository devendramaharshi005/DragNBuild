"use client";
import type { Edge, Node } from "reactflow";
import { X, Settings, Trash2 } from "lucide-react";
import { useAutomationStore } from "../store/automationStore";

interface ConfigPanelProps {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: () => void;
  onDeleteEdge: () => void;
}

export function ConfigPanel({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onDeleteNode,
  onDeleteEdge,
}: ConfigPanelProps) {
  const { simulationLog, setSelectedNode, setSelectedEdge } =
    useAutomationStore();

  // No selection case
  if (!selectedNode && !selectedEdge) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node or edge to configure</p>
          <p className="text-xs mt-2">
            Click on any element to edit its properties
          </p>
        </div>

        {simulationLog.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium text-gray-900 mb-3">Simulation Log</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {simulationLog.map((log, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="font-medium text-gray-900">{log.message}</div>
                  <div className="text-xs text-gray-500">{log.nodeType}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Edge selected case
  if (selectedEdge && !selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200">
        <div className="p-4 space-y-4">
          <div className="pt-4 border-gray-200">
            <button
              onClick={onDeleteEdge}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Edge</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Node selected case
  const updateNodeData = (key: string, value: any) => {
    if (!selectedNode) return;

    const updatedData = { ...selectedNode.data };

    if (key === "label") {
      updatedData.label = value;
    } else {
      updatedData.config = {
        ...updatedData.config,
        [key]: value,
      };
    }

    setSelectedNode({ ...selectedNode, data: updatedData });
    onUpdateNode(selectedNode.id, updatedData);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
            {selectedNode?.type?.toUpperCase()}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={onDeleteNode}
              className="p-1 hover:bg-red-100 rounded text-red-600"
              title="Delete node"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name:
          </label>
          <input
            type="text"
            value={selectedNode?.data.label || ""}
            onChange={(e) => updateNodeData("label", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter node name..."
          />
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={onDeleteNode}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete Node</span>
          </button>
        </div>
      </div>
    </div>
  );
}
