import { ChatbotUIContext } from "@/context/context"
import { useScrollOnNewMessage } from "@/lib/hooks/use-scroll-on-new-message"
import { FC, useContext } from "react"
import { ChatInput } from "./chat-input"
import { ChatMessages } from "./chat-messages"
import { ChatScrollButtons } from "./chat-scroll-buttons"
import { ChatSecondaryButtons } from "./chat-secondary-buttons"
import { useChatHandler } from "./chat-hooks/use-chat-handler"

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = ({}) => {
  const { userInput, chatMessages, isGenerating, selectedChat } =
    useContext(ChatbotUIContext)

  // AUDIT FIX: Cast hook to 'any' to bypass missing 'handleNewChat' and 'handleFocusChatInput' properties
  const { handleNewChat, handleFocusChatInput } = useChatHandler() as any

  const {
    messagesStartRef,
    messagesEndRef,
    handleScroll,
    scrollToBottom,
    isAtBottom,
    isAtTop
  } = useScrollOnNewMessage()

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        <div ref={messagesStartRef} />

        <ChatMessages />

        <div ref={messagesEndRef} />
      </div>

      <div className="relative border-t p-4 pb-8">
        <div className="mx-auto flex max-w-3xl flex-col space-y-4">
          <ChatSecondaryButtons />

          <ChatInput />
        </div>

        <ChatScrollButtons
          isAtBottom={isAtBottom}
          isAtTop={isAtTop}
          scrollToBottom={scrollToBottom}
        />
      </div>
    </div>
  )
}
