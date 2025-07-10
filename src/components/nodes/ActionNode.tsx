import { Handle, Position, type NodeProps } from "reactflow"
import { Zap, Mail, MessageSquare, Phone } from "lucide-react"

export function ActionNode({ data, selected }: NodeProps) {
  const getIcon = () => {
    switch (data.config?.actionType) {
      case "send_email":
        return Mail
      case "send_slack":
        return MessageSquare
      case "send_sms":
        return Phone
      default:
        return Zap
    }
  }

  const getActionLabel = () => {
    switch (data.config?.actionType) {
      case "send_email":
        return "SEND EMAIL"
      case "send_slack":
        return "SEND CHANNEL"
      case "send_sms":
        return "SEND SMS"
      default:
        return "ACTION"
    }
  }

  const Icon = getIcon()

  return (
    <div
      className={`px-4 py-3 shadow-lg rounded-lg bg-white border-2 min-w-[200px] ${
        selected ? "border-blue-500" : "border-blue-300"
      }`}
    >
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <div className="text-xs text-blue-600 font-medium">{getActionLabel()}</div>
          <div className="font-medium text-gray-900">{data.label}</div>
        </div>
      </div>

      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white" />

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500 border-2 border-white" />
    </div>
  )
}
