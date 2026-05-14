import { useState } from "react"
import { ChatMessage } from "@/types" // Updated import to use your main types
import { v4 as uuidv4 } from "uuid"

export function useChatHandler() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message])
  }

  const createUserMessage = (content: string, id: string): ChatMessage => ({
    message: {
      id: id || uuidv4(),
      chat_id: "",
      assistant_id: null,
      content: content,
      image_paths: [],
      model: "",
      role: "user",
      sequence_number: messages.length,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    fileItems: []
  })

  const createAssistantMessage = (
    content: string,
    id: string,
    metadata: any = {}
  ): ChatMessage => ({
    message: {
      id: id || uuidv4(),
      chat_id: "",
      assistant_id: null,
      content,
      image_paths: [],
      model: "sourcefield-v11",
      role: "assistant",
      sequence_number: messages.length + 1,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },

    fileItems: []
  })

  return {
    messages,
    setMessages,
    addMessage,
    createUserMessage,
    createAssistantMessage
  }
}
