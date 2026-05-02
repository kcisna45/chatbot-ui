import { useState } from "react"
import { ChatMessage } from "@/types/chatmessage"

export function useChatHandler() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const createUserMessage = (content: string, id: string): ChatMessage => ({
    id,
    role: "user",
    content,
    fileItems: []
  })

  const createAssistantMessage = (
    content: string,
    id: string
  ): ChatMessage => ({
    id,
    role: "assistant",
    content,
    fileItems: []
  })

  return {
    messages,
    addMessage,
    createUserMessage,
    createAssistantMessage
  }
}
