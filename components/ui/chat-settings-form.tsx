// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { ModelSelect } from "../models/model-select"
import { Slider } from "./slider"

interface ChatSettingsFormProps {}

export const ChatSettingsForm: FC<ChatSettingsFormProps> = ({}) => {
  const {
    profile,
    selectedChat,
    selectedModel,
    setSelectedModel,
    chatSettings,
    setChatSettings
  } = useContext(ChatbotUIContext) as any

  if (!profile) return null

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <div className="text-sm font-medium">Model</div>
        <ModelSelect
          selectedModelId={chatSettings.model}
          onSelectModel={modelId =>
            setChatSettings({ ...chatSettings, model: modelId })
          }
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Temperature</div>
          <div className="text-sm font-medium">{chatSettings.temperature}</div>
        </div>

        <Slider
          value={[chatSettings.temperature]}
          onValueChange={value =>
            setChatSettings({ ...chatSettings, temperature: value[0] })
          }
          min={0}
          max={1}
          step={0.1}
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Context Length</div>
          <div className="text-sm font-medium">
            {chatSettings.contextLength}
          </div>
        </div>

        <Slider
          value={[chatSettings.contextLength]}
          onValueChange={value =>
            setChatSettings({ ...chatSettings, contextLength: value[0] })
          }
          min={0}
          max={profile.has_premium ? 128000 : 4096}
          step={1024}
        />
      </div>
    </div>
  )
}
