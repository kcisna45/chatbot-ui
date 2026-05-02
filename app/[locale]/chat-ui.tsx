import React, { useEffect, useState } from "react"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatMessage } from "@/types/chatmessage"
import Loading from "@/components/ui/Loading"

export interface ChatUIProps {
  chatId: string
  userId: string
}

export const ChatUI: React.FC<ChatUIProps> = ({ chatId, userId }) => {
  const { messages, addMessage, createUserMessage, createAssistantMessage } =
    useChatHandler()

  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)

    const welcome: ChatMessage = createAssistantMessage(
      "Welcome to the chat!",
      chatId
    )
    addMessage(welcome)

    setLoading(false)
  }, [chatId, addMessage, createAssistantMessage]) // removed createUserMessage since not used here

  if (loading) return <Loading />

  return (
    <div className="flex size-full flex-col">
      {messages.map((msg: ChatMessage) => (
        <div key={msg.id} className="my-1 rounded border p-2">
          <strong>{msg.role}:</strong> {msg.content}
        </div>
      ))}
    </div>
  )
}

export default ChatUI
