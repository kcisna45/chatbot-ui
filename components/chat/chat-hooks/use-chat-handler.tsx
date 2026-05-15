import { ChatbotUIContext } from "@/context/context"
import type { ChatMessage } from "@/types/chatmessage"
import { useContext, useState } from "react"
import { v4 as uuidv4 } from "uuid"

export function useChatHandler() {
  const context = useContext(ChatbotUIContext) as any

  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([])

  const chatMessages = Array.isArray(context?.chatMessages)
    ? context.chatMessages
    : localMessages

  const setChatMessages =
    typeof context?.setChatMessages === "function"
      ? context.setChatMessages
      : setLocalMessages

  const createUserMessage = (content: string, id: string): ChatMessage => ({
    message: {
      id: id || uuidv4(),
      chat_id: "",
      assistant_id: null,
      content,
      image_paths: [],
      model: "",
      role: "user",
      sequence_number: chatMessages.length,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    fileItems: []
  })

  const createAssistantMessage = (
    content: string,
    id: string
  ): ChatMessage => ({
    message: {
      id: id || uuidv4(),
      chat_id: "",
      assistant_id: null,
      content,
      image_paths: [],
      model: "sourcefield-v11",
      role: "assistant",
      sequence_number: chatMessages.length + 1,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    fileItems: []
  })

  const handleSendMessage = async (content: string) => {
    console.log("🚀 Sending message:", content)

    const userMessage = createUserMessage(content, uuidv4())
    const updatedMessages = [...chatMessages, userMessage]

    setChatMessages(updatedMessages)

    try {
      const apiMessages = updatedMessages.map((chatMessage: any) => ({
        role: chatMessage.message?.role || chatMessage.role,
        content: chatMessage.message?.content || chatMessage.content
      }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: apiMessages
        })
      })

      const data = await response.json()

      console.log("🛰 API RESPONSE:", JSON.stringify(data, null, 2))

      const assistantMessage = createAssistantMessage(
        data.result || data.message || data.reply || "No response returned.",
        uuidv4()
      )

      setChatMessages([...updatedMessages, assistantMessage])
    } catch (error) {
      console.error("❌ Chat API Error:", error)

      const errorMessage = createAssistantMessage(
        "Error connecting to chat API.",
        uuidv4()
      )

      setChatMessages([...updatedMessages, errorMessage])
    }
  }

  const handleSendEdit = async () => {}

  return {
    messages: chatMessages,
    setMessages: setChatMessages,
    createUserMessage,
    createAssistantMessage,
    handleSendMessage,
    handleSendEdit
  }
}
