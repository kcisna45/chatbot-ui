// @ts-nocheck
import { Button } from "@/components/ui/button"
import { ChatbotUIContext } from "@/context/context"
import { IconPlus } from "@tabler/icons-react"
import { FC, useContext } from "react"
import { CreateAssistant } from "./items/assistants/create-assistant"
import { CreateChat } from "./items/chats/create-chat"
import { CreateCollection } from "./items/collections/create-collection"
import { CreateFile } from "./items/files/create-file"
import { CreateFolder } from "./items/folders/create-folder"
import { CreateModel } from "./items/models/create-model"
import { CreatePreset } from "./items/presets/create-preset"
import { CreatePrompt } from "./items/prompts/create-prompt"
import { CreateTool } from "./items/tools/create-tool"

interface SidebarCreateButtonProps {
  contentType: any
  hasAnyData: boolean
}

export const SidebarCreateButton: FC<SidebarCreateButtonProps> = ({
  contentType,
  hasAnyData
}) => {
  const { profile } = useContext(ChatbotUIContext) as any

  const renderCreateItem = () => {
    switch (contentType) {
      case "chats":
        return <CreateChat />
      case "presets":
        return <CreatePreset />
      case "prompts":
        return <CreatePrompt />
      case "files":
        return <CreateFile />
      case "collections":
        return <CreateCollection />
      case "assistants":
        return <CreateAssistant />
      case "tools":
        return <CreateTool />
      case "models":
        return <CreateModel />
      default:
        return null
    }
  }

  if (contentType === "all") return null

  return (
    <div className="flex w-full space-x-2">
      {renderCreateItem()}

      <CreateFolder contentType={contentType} />
    </div>
  )
}
