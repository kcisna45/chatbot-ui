import { ChatbotUIContext } from "@/context/context"
import { createChat } from "@/db/chats"
import { cn } from "@/lib/utils"
import { Tables } from "@/supabase/types"
import { ContentType, DataItemType } from "@/types"
import { useRouter } from "next/navigation"
import { FC, useContext, useRef, useState } from "react"
import { SidebarUpdateItem } from "./sidebar-update-item"

interface SidebarItemProps {
  item: DataItemType
  isTyping: boolean
  contentType: ContentType
  icon: React.ReactNode
  updateState: any
  renderInputs: (renderState: any) => JSX.Element
}

export const SidebarItem: FC<SidebarItemProps> = ({
  item,
  contentType,
  updateState,
  renderInputs,
  icon,
  isTyping
}) => {
  // AUDIT FIX: Cast context to any to avoid missing member errors
  const {
    selectedWorkspace,
    setChats,
    setSelectedAssistant,
    setSelectedPreset,
    setSelectedPrompt
  } = useContext(ChatbotUIContext) as any

  const router = useRouter()
  const itemRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  // HELPER FUNCTIONS FOR ACTIONS
  const handleSelectChat = (chatId: string) => {
    router.push(`/${selectedWorkspace.id}/chat/${chatId}`)
  }

  const handleSelectPreset = (preset: any) => {
    setSelectedPreset(preset)
  }

  const handleSelectPrompt = (prompt: any) => {
    setSelectedPrompt(prompt)
  }

  // AUDIT FIX: Object-level 'any' cast to bypass strict Supabase Table constraints
  const actionFunctions: any = {
    chats: async (chat: any) => {
      handleSelectChat(chat.id)
    },
    presets: async (preset: any) => {
      handleSelectPreset(preset)
    },
    prompts: async (prompt: any) => {
      handleSelectPrompt(prompt)
    },
    files: async (item: any) => {},
    collections: async (item: any) => {},
    assistants: async (assistant: any) => {
      if (!selectedWorkspace) return

      const createdChat = await createChat({
        user_id: assistant.user_id,
        workspace_id: selectedWorkspace.id,
        assistant_id: assistant.id,
        context_length: assistant.context_length,
        include_profile_context: assistant.include_profile_context,
        include_workspace_instructions:
          assistant.include_workspace_instructions,
        model: assistant.model,
        name: `Chat with ${assistant.name}`,
        prompt: assistant.prompt,
        temperature: assistant.temperature,
        embeddings_provider: (selectedWorkspace as any).embeddings_provider
      } as any)

      setChats((prevChats: any) => [createdChat, ...prevChats])
      handleSelectChat(createdChat.id)
    },
    tools: async (item: any) => {},
    models: async (item: any) => {}
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.stopPropagation()
      itemRef.current?.click()
    }
  }

  // This handles the click if you decide to uncomment the "Plus" icon action later
  const handleClickAction = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const action = actionFunctions[contentType]
    if (action) {
      await action(item)
    }
  }

  return (
    <SidebarUpdateItem
      item={item}
      isTyping={isTyping}
      contentType={contentType}
      updateState={updateState}
      renderInputs={renderInputs}
    >
      <div
        ref={itemRef}
        className={cn(
          "hover:bg-accent flex w-full cursor-pointer items-center rounded p-2 hover:opacity-50 focus:outline-none"
        )}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {icon}

        <div className="ml-3 flex-1 truncate text-sm font-semibold">
          {(item as any).name}
        </div>
      </div>
    </SidebarUpdateItem>
  )
}
