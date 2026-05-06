import { ChatbotUIContext } from "@/context/context"
import { LLMID, ModelProvider } from "@/types"
import { FC, useContext } from "react"
import { ModelSelect } from "../models/model-select"
import { Button } from "../ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet"
import { IconSettings } from "@tabler/icons-react"
import { ChatSettingsForm } from "./chat-settings-form"

interface ChatSettingsProps {}

export const ChatSettings: FC<ChatSettingsProps> = ({}) => {
  const { chatSettings, setChatSettings, models, availableModels } =
    useContext(ChatbotUIContext)

  // AUDIT FIX: Cast 'model' to any to resolve 'unknown' type error in mapping
  const allModels = [
    ...models.map((model: any) => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platform: "custom",
      imageInput: false
    })),
    ...availableModels
  ]

  if (!chatSettings) return null

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconSettings size={24} />
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col overflow-auto sm:max-w-[450px]">
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          <div className="space-y-2">
            <ModelSelect
              selectedModelId={chatSettings.model}
              onSelectModel={modelId =>
                setChatSettings({ ...chatSettings, model: modelId as LLMID })
              }
              allModels={allModels}
            />
          </div>

          <ChatSettingsForm
            chatSettings={chatSettings}
            onChangeChatSettings={setChatSettings}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}
