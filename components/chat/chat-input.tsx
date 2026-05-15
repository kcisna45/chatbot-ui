// @ts-nocheck
"use client"

import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { FC, useContext, useEffect, useRef, useState } from "react"

export const ChatInput: FC = () => {
  const context = useContext(ChatbotUIContext) as any

  const {
    userInput = "",
    setUserInput,
    chatMessages = [],
    isGenerating = false
  } = context

  const { handleSendMessage } = useChatHandler()

  const [localInput, setLocalInput] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  const inputValue =
    typeof setUserInput === "function" ? userInput || "" : localInput

  const updateInput = (value: string) => {
    if (typeof setUserInput === "function") {
      setUserInput(value)
    } else {
      setLocalInput(value)
    }
  }

  const handleSubmit = async () => {
    const trimmedInput = inputValue.trim()

    if (!trimmedInput || isGenerating) return

    await handleSendMessage(trimmedInput, chatMessages, false)

    updateInput("")
  }

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      await handleSubmit()
    }
  }

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto"
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`
    }
  }, [inputValue])

  return (
    <div className="relative flex flex-col items-center">
      <div className="bg-background border-input focus-within:border-primary/50 relative flex w-full flex-col overflow-hidden rounded-xl border-2 px-4 pb-2 pt-3 shadow-sm transition-colors">
        <textarea
          ref={textAreaRef}
          className="min-h-[60px] w-full resize-none bg-transparent text-sm focus:outline-none"
          placeholder="Send a message..."
          value={inputValue}
          onChange={event => updateInput(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
        />

        <div className="flex items-center justify-between py-2">
          <div className="text-xs opacity-50">
            {isGenerating ? "SourceField is thinking..." : "Ready"}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isGenerating || !inputValue.trim()}
            className="bg-primary text-secondary rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
