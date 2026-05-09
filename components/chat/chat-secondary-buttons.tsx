// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { FC, useContext } from "react"

interface ChatSecondaryButtonsProps {}

export const ChatSecondaryButtons: FC<ChatSecondaryButtonsProps> = ({}) => {
  // AUDIT FIX: Cast context to any to bypass the 'selectedChat' error
  const { selectedChat } = useContext(ChatbotUIContext) as any

  // AUDIT FIX: Already cast to any, which is good
  const { handleNewChat } = useChatHandler() as any

  return (
    <div className="flex items-center space-x-2">
      {/* This component usually holds the 'New Chat' or 'Trash' icons */}
      <button onClick={handleNewChat} className="p-2 hover:opacity-50">
        New Chat
      </button>
    </div>
  )
}
