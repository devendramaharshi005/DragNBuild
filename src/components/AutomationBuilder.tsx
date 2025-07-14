"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  addEdge,
  type Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  type ReactFlowInstance,
  ConnectionLineType,
} from "reactflow";
import { Sidebar } from "./Sidebar";
import { Toolbar } from "./Toolbar";
import { ConfigPanel } from "./ConfigPanel";
import { nodeTypes } from "./nodes";
import { FlowState, useAutomationStore } from "../store/automationStore";
import toast from "react-hot-toast";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const getFlowStateFromLocalStorage = (): FlowState | null => {
  const raw = localStorage.getItem("automation-flow");
  try {
    console.log(raw);
    return raw ? (JSON.parse(raw) as FlowState) : null;
  } catch {
    return null;
  }
};

export function AutomationBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    getFlowStateFromLocalStorage()?.nodes || initialNodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    getFlowStateFromLocalStorage()?.edges || initialEdges
  );
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    selectedNode,
    selectedEdge,
    setSelectedEdge,
    setSelectedNode,
    simulationLog,
    clearSimulationLog,
    history,
    historyIndex,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAutomationStore();

  // Save current state to history when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      addToHistory({ nodes, edges });
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [nodes, edges, addToHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete selected node
      if (event.key === "Delete" && selectedNode) {
        event.preventDefault();
        deleteSelectedNode();
      }

      // Undo/Redo
      if (event.ctrlKey || event.metaKey) {
        if (event.key === "z" && !event.shiftKey) {
          event.preventDefault();
          handleUndo();
        } else if ((event.key === "z" && event.shiftKey) || event.key === "y") {
          event.preventDefault();
          handleRedo();
        }
        // Save
        if (event.key === "s") {
          event.preventDefault();
          saveFlow();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedNode]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (typeof type === "undefined" || !type) {
        return;
      }

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: getDefaultLabel(type),
          config: getDefaultConfig(type),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setSelectedEdge(null);
    },
    [setSelectedNode]
  );

  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      setSelectedEdge(edge);
      setSelectedNode(null);
    },
    [setSelectedEdge]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, [setSelectedNode]);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNode.id && edge.target !== selectedNode.id
      )
    );
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges, setSelectedNode]);

  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdge) return;

    setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge.id));
    setSelectedEdge(null);
  }, [selectedEdge, setEdges, setSelectedEdge]);

  const exportFlow = useCallback(() => {
    const flow = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
    const dataStr = JSON.stringify(flow, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `automation-flow-${
      new Date().toISOString().split("T")[0]
    }.json`;
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  }, [nodes, edges]);

  const loadFlow = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileLoad = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const flowData = JSON.parse(e.target?.result as string);
          if (flowData.nodes && flowData.edges) {
            setNodes(flowData.nodes);
            setEdges(flowData.edges);
            setSelectedNode(null);
            clearSimulationLog();
          } else {
            alert("Invalid flow file format");
          }
        } catch (error) {
          alert("Error loading flow file");
          console.error("Error loading flow:", error);
        }
      };
      reader.readAsText(file);

      // Reset file input
      event.target.value = "";
    },
    [setNodes, setEdges, setSelectedNode, clearSimulationLog]
  );

  const saveFlow = useCallback(() => {
    const flow = {
      nodes,
      edges,
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    };
    localStorage.setItem("automation-flow", JSON.stringify(flow));

    // Show temporary save confirmation
    const originalTitle = document.title;
    document.title = "✓ Saved - Message Flow";
    toast.success("Message Flow is Saved!");
    setTimeout(() => {
      document.title = originalTitle;
    }, 2000);
  }, [nodes, edges]);

  const resetCanvas = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    clearSimulationLog();
    // reset local storage.
    localStorage.setItem("automation-flow", JSON.stringify([]));
    toast.success("New Flow created!");
  }, [setNodes, setEdges, setSelectedNode, clearSimulationLog]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      setSelectedNode(null);
    }
  }, [undo, setNodes, setEdges, setSelectedNode]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setSelectedNode(null);
    }
  }, [redo, setNodes, setEdges, setSelectedNode]);

  return (
    <div className="flex h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileLoad}
        style={{ display: "none" }}
      />

      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Toolbar
          onExport={exportFlow}
          onLoad={loadFlow}
          onSave={saveFlow}
          onReset={resetCanvas}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={canUndo}
          canRedo={canRedo}
          onDelete={
            selectedNode
              ? deleteSelectedNode
              : selectedEdge
              ? deleteSelectedEdge
              : undefined
          }
        />

        <div className="flex-1 flex">
          <div className="flex-1" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gray-50"
              deleteKeyCode="Delete"
              connectionLineType={ConnectionLineType.SmoothStep}
            >
              <Controls />
              <MiniMap />
              <Background gap={12} size={1} />
            </ReactFlow>
          </div>

          <ConfigPanel
            selectedNode={selectedNode}
            selectedEdge={selectedEdge}
            onUpdateNode={(nodeId, data) => {
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === nodeId
                    ? { ...node, data: { ...node.data, ...data } }
                    : node
                )
              );
            }}
            onDeleteNode={deleteSelectedNode}
            onDeleteEdge={deleteSelectedEdge}
          />
        </div>
      </div>
    </div>
  );
}

function getDefaultLabel(type: string): string {
  switch (type) {
    default:
      return "Test Message";
  }
}

function getDefaultConfig(type: string): any {
  switch (type) {
    default:
      return {};
  }
}
