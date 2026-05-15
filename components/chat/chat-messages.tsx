// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages = [] } = useContext(ChatbotUIContext) as any

  return (
    <div className="flex flex-col space-y-4 p-4">
      {chatMessages.map((chatMessage: any) => {
        const message = chatMessage.message || chatMessage

        return (
          <div key={message.id} className="flex flex-col">
            <div className="font-bold">
              {message.role === "user" ? "You" : "SourceField"}
            </div>

            <div className="whitespace-pre-wrap text-sm">{message.content}</div>
          </div>
        )
      })}
    </div>
  )
}
