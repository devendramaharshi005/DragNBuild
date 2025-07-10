import { TriggerNode } from "./TriggerNode"
import { ConditionNode } from "./ConditionNode"
import { ActionNode } from "./ActionNode"
import { AINode } from "./AINode"
import { EndNode } from "./EndNode"

export const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  ai: AINode,
  end: EndNode,
}
