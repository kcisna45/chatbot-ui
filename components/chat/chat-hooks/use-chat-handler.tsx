import { useState } from "react"
import type { ChatMessage } from "@/types/chatmessage" // Updated import to use your main types
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

  const handleSendMessage = async (content: string) => {
    console.log("🚀 Sending message:", content)

    const userMessage = createUserMessage(content, uuidv4())

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content
            }
          ]
        })
      })

      const data = await response.json()

      console.log("🛰 API RESPONSE:", JSON.stringify(data, null, 2))

      const assistantMessage = createAssistantMessage(
        data.result || data.message || data.reply || "No response returned.",
        uuidv4()
      )

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("❌ Chat API Error:", error)

      const errorMessage = createAssistantMessage(
        "Error connecting to chat API.",
        uuidv4()
      )

      setMessages(prev => [...prev, errorMessage])
    }
  }

  return {
    messages,
    setMessages,
    addMessage,
    createUserMessage,
    createAssistantMessage,
    handleSendMessage
  }
}
