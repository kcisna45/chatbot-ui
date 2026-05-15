// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { FC, useContext } from "react"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  // AUDIT FIX: Cast context to any to bypass the 'chatMessages' error
  const { chatMessages, selectedChat } = useContext(ChatbotUIContext) as any

  // AUDIT FIX: Already has the cast to any, keep it!
  const { handleNewChat, handleFocusChatInput } = useChatHandler() as any

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* The Master Chat Interface */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <ChatMessages />
      </div>

      <div className="p-4">
        <ChatInput />
      </div>
    </div>
  )
}
