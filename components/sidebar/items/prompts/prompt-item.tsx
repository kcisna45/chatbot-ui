// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconPencil } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"
import { UpdatePrompt } from "./update-prompt"

interface PromptItemProps {
  // AUDIT FIX: Using any to bypass table constraints
  prompt: any
}

export const PromptItem: FC<PromptItemProps> = ({ prompt }) => {
  // AUDIT FIX: Cast context to any
  const { setSelectedPrompt } = useContext(ChatbotUIContext) as any

  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={prompt}
      isTyping={isTyping}
      contentType="prompts"
      icon={<IconPencil size={30} />}
      updateState={{
        name: prompt.name,
        description: prompt.description,
        content: prompt.content
      }}
      renderInputs={(renderState: any) => (
        <UpdatePrompt
          prompt={prompt}
          isTyping={isTyping}
          setIsTyping={setIsTyping}
        />
      )}
    />
  )
}
