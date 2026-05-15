// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages = [] } = useContext(ChatbotUIContext) as any

  return (
    <div className="flex min-h-0 w-full flex-col space-y-4 overflow-y-auto p-4">
      {chatMessages.map((chatMessage: any) => {
        const message = chatMessage.message || chatMessage

        return (
          <div
            key={message.id}
            className="flex w-full max-w-full flex-col break-words"
          >
            <div className="mb-1 font-bold">
              {message.role === "user" ? "You" : "SourceField"}
            </div>

            <div className="w-full max-w-full whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}
