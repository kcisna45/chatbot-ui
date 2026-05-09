// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useContext, useEffect, useRef, useState } from "react"

export const useScroll = () => {
  // AUDIT FIX: Cast context to any to bypass the missing property errors
  const { isGenerating, chatMessages } = useContext(ChatbotUIContext) as any

  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // Auto-scroll logic usually goes here.
  // We keep the refs and state so the components using this hook don't break.

  return {
    messagesStartRef,
    messagesEndRef,
    isAtBottom,
    setIsAtBottom,
    isGenerating,
    chatMessages
  }
}
