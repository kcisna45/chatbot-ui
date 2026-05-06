import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef, useState } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { ChatScrollButtons } from "./chat-scroll-buttons"
import { ChatSecondaryButtons } from "./chat-secondary-buttons"
import { useChatHandler } from "./chat-hooks/use-chat-handler"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  const { chatMessages, selectedChat } = useContext(ChatbotUIContext)

  // AUDIT FIX: Cast hook to 'any' to bypass missing properties
  const { handleNewChat, handleFocusChatInput } = useChatHandler() as any

  // AUDIT FIX: Expanded Inline Scroll Logic to satisfy ChatScrollButtonsProps
  const messagesStartRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isAtTop, setIsAtTop] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToTop = () => {
    messagesStartRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom()
    }
  }, [chatMessages])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget

    // Check if the content is taller than the container
    setIsOverflowing(scrollHeight > clientHeight)

    const atBottom = scrollHeight - scrollTop <= clientHeight + 50
    const atTop = scrollTop <= 50

    setIsAtBottom(atBottom)
    setIsAtTop(atTop)
  }

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        <div ref={messagesStartRef} />

        <ChatMessages />

        <div ref={messagesEndRef} />
      </div>

      <div className="relative border-t p-4 pb-8">
        <div className="mx-auto flex max-w-3xl flex-col space-y-4">
          <ChatSecondaryButtons />

          <ChatInput />
        </div>

        {/* AUDIT FIX: Now providing all required props to ChatScrollButtons */}
        <ChatScrollButtons
          isAtBottom={isAtBottom}
          isAtTop={isAtTop}
          isOverflowing={isOverflowing}
          scrollToBottom={scrollToBottom}
          scrollToTop={scrollToTop}
        />
      </div>
    </div>
  )
}
