"use client";
import type { Node } from "reactflow";
import { X, Settings, Trash2 } from "lucide-react";
import { useAutomationStore } from "../store/automationStore";
import { useEffect, useState } from "react";

interface ConfigPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: () => void;
}

export function ConfigPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
}: ConfigPanelProps) {
  const { simulationLog, setSelectedNode } = useAutomationStore();

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 p-4">
        <div className="text-center text-gray-500 mt-8">
          <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a node to configure</p>
          <p className="text-xs mt-2">
            Click on any node to edit its properties
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

  const updateNodeConfig = (config: any) => {
    const updatedData = {
      ...selectedNode.data,
      config: { ...selectedNode.data.config, ...config },
    };
    setSelectedNode({ ...selectedNode, data: updatedData });
    onUpdateNode(selectedNode.id, updatedData);
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900">
            {selectedNode.type?.toUpperCase()}: {selectedNode.data.label}
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
            value={selectedNode.data.label || ""}
            onChange={(e) => updateNodeData("label", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter node name..."
          />
        </div>

        {selectedNode.type === "trigger" && (
          <TriggerConfig
            config={selectedNode.data.config || {}}
            onUpdate={updateNodeConfig}
          />
        )}

        {selectedNode.type === "condition" && (
          <ConditionConfig
            config={selectedNode.data.config || {}}
            onUpdate={updateNodeConfig}
          />
        )}

        {selectedNode.type === "action" && (
          <ActionConfig
            config={selectedNode.data.config || {}}
            onUpdate={updateNodeConfig}
          />
        )}

        {selectedNode.type === "ai" && (
          <AIConfig
            config={selectedNode.data.config || {}}
            onUpdate={updateNodeConfig}
          />
        )}

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

// Rest of the component functions remain the same...
function TriggerConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  const eventTypes = [
    { value: "new_ticket_created", label: "New Ticket Created" },
    { value: "field_changed", label: "Field Changed" },
    { value: "status_updated", label: "Status Updated" },
    { value: "user_registered", label: "User Registered" },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Event Type:
      </label>
      <select
        value={config.eventType || "new_ticket_created"}
        onChange={(e) => onUpdate({ ...config, eventType: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {eventTypes.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ConditionConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  const fields = ["priority", "status", "category", "assignee"];
  const operators = [
    "equals",
    "not_equals",
    "contains",
    "greater_than",
    "less_than",
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Field:
        </label>
        <select
          value={config.field || "priority"}
          onChange={(e) => onUpdate({ ...config, field: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Operator:
        </label>
        <select
          value={config.operator || "equals"}
          onChange={(e) => onUpdate({ ...config, operator: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {operators.map((operator) => (
            <option key={operator} value={operator}>
              {operator.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value:
        </label>
        <input
          type="text"
          value={config.value || ""}
          onChange={(e) => onUpdate({ ...config, value: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter value..."
        />
      </div>
    </div>
  );
}

function ActionConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  const actionTypes = [
    { value: "send_email", label: "Send Email" },
    { value: "send_slack", label: "Send Slack Message" },
    { value: "update_status", label: "Update Status" },
    { value: "create_ticket", label: "Create Ticket" },
    { value: "send_sms", label: "Send SMS" },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Action Type:
        </label>
        <select
          value={config.actionType || "send_email"}
          onChange={(e) => onUpdate({ ...config, actionType: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {actionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {config.actionType === "send_email" && (
        <EmailActionConfig config={config} onUpdate={onUpdate} />
      )}

      {config.actionType === "send_slack" && (
        <SlackActionConfig config={config} onUpdate={onUpdate} />
      )}
    </div>
  );
}

function EmailActionConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subject:
        </label>
        <input
          type="text"
          value={config.subject || ""}
          onChange={(e) => onUpdate({ ...config, subject: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="The subject of the email."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Body:
        </label>
        <textarea
          value={config.body || ""}
          onChange={(e) => onUpdate({ ...config, body: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="The body of the email."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          To:
        </label>
        <input
          type="email"
          value={config.to || ""}
          onChange={(e) => onUpdate({ ...config, to: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="The recipient of the email."
        />
      </div>
    </div>
  );
}

function SlackActionConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel:
        </label>
        <input
          type="text"
          value={config.channel || ""}
          onChange={(e) => onUpdate({ ...config, channel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#general"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message:
        </label>
        <textarea
          value={config.message || ""}
          onChange={(e) => onUpdate({ ...config, message: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          placeholder="Message to send..."
        />
      </div>
    </div>
  );
}

function AIConfig({
  config,
  onUpdate,
}: {
  config: any;
  onUpdate: (config: any) => void;
}) {
  const models = ["gpt-4", "gpt-3.5-turbo", "claude-3", "gemini-pro"];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Model:
        </label>
        <select
          value={config.model || "gpt-4"}
          onChange={(e) => onUpdate({ ...config, model: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prompt:
        </label>
        <textarea
          value={config.prompt || ""}
          onChange={(e) => onUpdate({ ...config, prompt: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Enter your AI prompt..."
        />
      </div>
    </div>
  );
}
