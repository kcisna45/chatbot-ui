"use client"

import { createContext, useContext, ReactNode, useState } from "react"

export type LLMID = "gpt-4-1106-preview" | "gpt-4" | "gpt-3.5-turbo"

interface ChatbotUIContextProps {
  llm: LLMID
  setLLM: (llm: LLMID) => void
}

const ChatbotUIContext = createContext<ChatbotUIContextProps | undefined>(
  undefined
)

export const ChatbotUIProvider = ({ children }: { children: ReactNode }) => {
  const [llm, setLLM] = useState<LLMID>("gpt-4-1106-preview")

  return (
    <ChatbotUIContext.Provider value={{ llm, setLLM }}>
      {children}
    </ChatbotUIContext.Provider>
  )
}

export const useChatbotUI = () => {
  const context = useContext(ChatbotUIContext)
  if (!context) {
    throw new Error("useChatbotUI must be used within a ChatbotUIProvider")
  }
  return context
}
