"use client"

import { ChatMessage } from "@/types"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useChatStore } from "@/providers/chat-store"
import { useMessageHandler } from "@/lib/hooks/use-message-handler"
import { useChats } from "@/lib/hooks/use-chats"
import { useMessages } from "@/lib/hooks/use-messages"

export const useChatHandler = () => {
  const { currentChat, setCurrentChat, setChats } = useChatStore()
  const { setChatMessages } = useMessageHandler()
  const { handleCreateChat } = useChats()
  const { handleCreateMessages } = useMessages()
  const [isTyping, setIsTyping] = useState(false)

const handleFocusChatInput = () => {
  const inputElement = document.querySelector("input");
  if (inputElement) {
    inputElement.focus();
  }
};
  
  const handleSendMessage = async (
    messageContent: string,
    chatMessages: ChatMessage[],
    isRegeneration: boolean
  ) => {
    // 🚀 Step 1: Confirm the function is firing
    console.log("🚀 handleSendMessage triggered:", {
      messageContent,
      chatMessages,
      isRegeneration
    })

    if (!currentChat) {
      const chat = await handleCreateChat(messageContent)
      if (!chat) return
      setCurrentChat(chat)
      setChats(prev => [chat, ...prev])
    }

    if (!currentChat) return

    const userMessage: ChatMessage = {
      id: uuidv4(),
      chat_id: currentChat.id,
      content: messageContent,
      role: "user",
      created_at: new Date().toISOString()
    }

    const updatedMessages = [...chatMessages, userMessage]

    // 🧠 Step 2: Log the messages before generation
    console.log(
      "🧠 Setting chat messages (before generation):",
      updatedMessages
    )

    setChatMessages(updatedMessages)
    setIsTyping(true)

    const generatedText = "This is a placeholder response from the AI." // <-- Replace with your generateText() call if needed

    const assistantMessage: ChatMessage = {
      id: uuidv4(),
      chat_id: currentChat.id,
      content: generatedText,
      role: "assistant",
      created_at: new Date().toISOString()
    }

    const finalMessages = [...updatedMessages, assistantMessage]

    // 🧠 Step 3: Log the messages after assistant response
    console.log("🧠 Setting chat messages (final):", finalMessages)

    setChatMessages(finalMessages)
    setIsTyping(false)

    // 📨 Step 4: Log before saving to DB
    console.log("📨 Creating messages with:", {
      currentChat,
      messageContent,
      generatedText,
      chatMessagesLength: chatMessages.length
    })

    await handleCreateMessages([userMessage, assistantMessage])
  }

  return {
    handleFocusChatInput,
    handleSendMessage,
    isTyping
  }
}
