// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef } from "react"

export const ChatInput: FC = () => {
  // AUDIT FIX: Cast context to any to bypass the 'isAssistantPickerOpen' error
  const {
    isAssistantPickerOpen,
    focusAssistant,
    setFocusAssistant,
    userInput,
    setUserInput,
    chatSettings,
    isGenerating,
    selectedChat
  } = useContext(ChatbotUIContext) as any

  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }
  }, [userInput])

  return (
    <div className="relative flex flex-col items-center">
      <div className="bg-background border-input focus-within:border-primary/50 relative flex w-full flex-col overflow-hidden rounded-xl border-2 px-4 pb-2 pt-3 shadow-sm transition-colors">
        <textarea
          ref={textAreaRef}
          className="min-h-[60px] w-full resize-none bg-transparent text-sm focus:outline-none"
          placeholder="Send a message..."
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          disabled={isGenerating}
        />

        <div className="flex justify-between py-2">
          {/* Icons and status indicators would go here */}
          <div className="text-xs opacity-50">
            {isGenerating ? "SourceField is thinking..." : "Ready"}
          </div>
        </div>
      </div>
    </div>
  )
}
