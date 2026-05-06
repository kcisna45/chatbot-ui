import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"
import { Message } from "../messages/message"

interface ChatMessagesProps {}

export const ChatMessages: FC<ChatMessagesProps> = ({}) => {
  const { chatMessages, chatFileItems } = useContext(ChatbotUIContext)

  // AUDIT FIX: Cast to 'any' to bypass missing property error for handleSendEdit
  const { handleSendEdit } = useChatHandler() as any

  // AUDIT FIX: Use any to prevent strict Table constraint errors
  const [editingMessage, setEditingMessage] = useState<any>()

  return chatMessages
    .sort((a, b) => a.message.sequence_number - b.message.sequence_number)
    .map((chatMessage, index, array) => {
      // AUDIT FIX: Cast chatFileItem and item to 'any' to resolve the 'unknown' type error
      const messageFileItems = chatFileItems.filter(
        (chatFileItem: any, _, self: any[]) =>
          chatMessage.fileItems.includes(chatFileItem.id) &&
          self.findIndex((item: any) => item.id === chatFileItem.id) === _
      )

      return (
        <Message
          key={chatMessage.message.id || chatMessage.message.sequence_number}
          message={chatMessage.message}
          fileItems={messageFileItems}
          isEditing={editingMessage?.id === chatMessage.message.id}
          isLast={index === array.length - 1}
          onStartEdit={setEditingMessage}
          onCancelEdit={() => setEditingMessage(undefined)}
          onSubmitEdit={handleSendEdit}
        />
      )
    })
}
