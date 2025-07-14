import { create } from "zustand";
import {
  type Node,
  type Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
} from "reactflow";

interface SimulationLog {
  nodeId: string;
  nodeType: string;
  message: string;
  timestamp: string;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
}

interface AutomationStore {
  selectedNode: Node | null;
  selectedEdge: Edge | null;
  simulationLog: SimulationLog[];
  history: Array<FlowState>;
  historyIndex: number;
  setSelectedNode: (node: Node | null) => void;
  setSelectedEdge: (node: Edge | null) => void;
  addSimulationLog: (log: SimulationLog) => void;
  clearSimulationLog: () => void;
  addToHistory: (state: FlowState) => void;
  undo: () => FlowState | null;
  redo: () => FlowState | null;
  canUndo: boolean;
  canRedo: boolean;
}



export const useAutomationStore = create<AutomationStore>((set, get) => ({
  selectedNode: null,
  selectedEdge: null,
  simulationLog: [],
  history: [],
  historyIndex: -1,

  setSelectedNode: (node) => set({ selectedNode: node }),
  setSelectedEdge: (edge) => set({ selectedEdge: edge }),

  addSimulationLog: (log) =>
    set((state) => ({
      simulationLog: [...state.simulationLog, log],
    })),

  clearSimulationLog: () => set({ simulationLog: [] }),

  addToHistory: (state) => {
    const { history, historyIndex } = get();

    // Don't add if it's the same as the current state
    if (
      history[historyIndex] &&
      JSON.stringify(history[historyIndex]) === JSON.stringify(state)
    ) {
      return;
    }

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(state);

    // Limit history size to 50 entries
    if (newHistory.length > 50) {
      newHistory.shift();
    } else {
      set({ historyIndex: historyIndex + 1 });
    }

    set({ history: newHistory });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ historyIndex: newIndex });
      return history[newIndex];
    }
    return null;
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ historyIndex: newIndex });
      return history[newIndex];
    }
    return null;
  },

  get canUndo() {
    return get().historyIndex > 0;
  },

  get canRedo() {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },
}));
