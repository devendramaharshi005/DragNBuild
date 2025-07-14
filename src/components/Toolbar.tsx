"use client";
import {
  Download,
  Save,
  Upload,
  Plus,
  Undo,
  Redo,
  Trash2,
} from "lucide-react";

interface ToolbarProps {
  onExport: () => void;
  onLoad: () => void;
  onSave: () => void;
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete?: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function Toolbar({
  onExport,
  onLoad,
  onSave,
  onReset,
  onUndo,
  onRedo,
  onDelete,
  canUndo,
  canRedo,
}: ToolbarProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Undo className="w-4 h-4" />
            <span>Undo</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Redo className="w-4 h-4" />
            <span>Redo</span>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={onSave}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>

          <button
            onClick={onLoad}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            <span>Load</span>
          </button>

          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
            <span>New</span>
          </button>

          {onDelete && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={onDelete}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onExport}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>
    </div>
  );
}
