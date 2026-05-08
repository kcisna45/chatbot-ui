// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { AssistantItem } from "./items/assistants/assistant-item"
import { ChatItem } from "./items/chats/chat-item"
import { CollectionItem } from "./items/collections/collection-item"
import { FileItem } from "./items/files/file-item"
import { ModelItem } from "./items/models/model-item"
import { PresetItem } from "./items/presets/preset-item"
import { PromptItem } from "./items/prompts/prompt-item"
import { ToolItem } from "./items/tools/tool-item"

interface SidebarDataListProps {
  contentType: any
  data: any[]
}

export const SidebarDataList: FC<SidebarDataListProps> = ({
  contentType,
  data
}) => {
  const { folders } = useContext(ChatbotUIContext) as any

  return (
    <div>
      {data.map(item => {
        switch (contentType) {
          case "chats":
            return <ChatItem key={item.id} chat={item} />
          case "presets":
            return <PresetItem key={item.id} preset={item} />
          case "prompts":
            return <PromptItem key={item.id} prompt={item} />
          case "files":
            return <FileItem key={item.id} file={item} />
          case "collections":
            return <CollectionItem key={item.id} collection={item} />
          case "assistants":
            return <AssistantItem key={item.id} assistant={item} />
          case "tools":
            return <ToolItem key={item.id} tool={item} />
          case "models":
            return <ModelItem key={item.id} model={item} />
          default:
            return null
        }
      })}
    </div>
  )
}
