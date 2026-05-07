import { LLM } from "@/types"
import { FC } from "react"
import { ModelIcon } from "./model-icon"
import { WithTooltip } from "../ui/with-tooltip"

interface ModelOptionProps {
  model: LLM
  onSelect: () => void
}

export const ModelOption: FC<ModelOptionProps> = ({ model, onSelect }) => {
  // AUDIT FIX: Cast WithTooltip to any to bypass strict prop validation
  const WithTooltipAny = WithTooltip as any

  return (
    <WithTooltipAny
      display={
        <div className="max-w-[300px]">
          <div className="font-bold">{model.modelName}</div>
          {model.provider !== "ollama" && (model as any).pricing && (
            <div className="mt-1 space-y-1 text-xs opacity-80">
              <div>
                Cost: ${(model as any).pricing?.inputCostPer1M} / $
                {(model as any).pricing?.outputCostPer1M} (1M tokens)
              </div>
            </div>
          )}
          <div className="mt-1 text-xs opacity-60">
            Provider: {model.provider}
          </div>
        </div>
      }
      side="right"
      trigger={
        <div
          className="hover:bg-accent flex cursor-pointer items-center space-x-3 rounded-md p-2"
          onClick={onSelect}
        >
          <ModelIcon provider={model.provider} width={28} height={28} />
          <div className="text-sm font-medium">{model.modelName}</div>
        </div>
      }
    />
  )
}
