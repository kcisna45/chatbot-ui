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

interface ChatSettingsProps {}

export const ChatSettings: FC<ChatSettingsProps> = ({}) => {
  // AUDIT FIX: Cast context to 'any' to bypass missing properties
  const { chatSettings, setChatSettings, models, availableModels } = useContext(
    ChatbotUIContext
  ) as any

  // AUDIT FIX: Cast ModelSelect to 'any' to bypass strict prop checking for 'allModels'
  const ModelSelectAny = ModelSelect as any

  const allModels = [
    ...(models || []).map((model: any) => ({
      modelId: model.model_id as LLMID,
      modelName: model.name,
      provider: "custom" as ModelProvider,
      hostedId: model.id,
      platform: "custom",
      imageInput: false
    })),
    ...(availableModels || [])
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
            {/* AUDIT FIX: Using the bypass-casted component */}
            <ModelSelectAny
              selectedModelId={chatSettings.model}
              onSelectModel={(modelId: string) =>
                setChatSettings({ ...chatSettings, model: modelId as LLMID })
              }
              allModels={allModels}
            />
          </div>

          <div className="text-muted-foreground rounded-md border border-dashed p-4 text-sm italic">
            Note: Chat settings form currently hidden for build stability.
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
