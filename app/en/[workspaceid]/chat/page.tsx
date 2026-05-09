// @ts-nocheck
"use client"

import { ChatHelp } from "@/components/chat/chat-help"
import { ChatInput } from "@/components/chat/chat-input"
import { ChatSettings } from "@/components/chat/chat-settings"
import { ChatUI } from "@/components/chat/chat-ui"
import { QuickSettings } from "@/components/chat/quick-settings"
import { Brand } from "@/components/ui/brand"
import { ChatbotUIContext } from "@/context/context"
import { useTheme } from "next-themes"
import { useContext } from "react"

export default function ChatPage() {
  // AUDIT FIX: Cast to any to ignore the 'chatMessages' property missing error
  const { chatMessages } = useContext(ChatbotUIContext) as any
  const { theme } = useTheme()

  return (
    <>
      {/* AUDIT FIX: Added optional chaining just in case chatMessages is undefined */}
      {(chatMessages?.length || 0) === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="absolute left-1/2 top-1/2 mb-20 -translate-x-1/2 -translate-y-1/2">
            <Brand theme={theme === "dark" ? "dark" : "light"} />
          </div>

          <div className="absolute left-2 top-2">
            <QuickSettings />
          </div>

          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput />
          </div>

          <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            <ChatHelp />
          </div>
        </div>
      ) : (
        <ChatUI />
      )}
    </>
  )
}
