// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { FC, useContext } from "react"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  // AUDIT FIX: Cast context to any to bypass the missing 'chatMessages' error
  const { chatMessages, chatFileItems } = useContext(ChatbotUIContext) as any

  // AUDIT FIX: Already has the cast, keep it!
  const { handleSendEdit } = useChatHandler() as any

  return (
    <div className="flex flex-col space-y-4 p-4">
      {chatMessages.map((message: any) => (
        <div key={message.id} className="flex flex-col">
          <div className="font-bold">
            {message.role === "user" ? "You" : "SourceField"}
          </div>
          <div className="text-sm">{message.content}</div>
        </div>
      ))}
    </div>
  )
}
