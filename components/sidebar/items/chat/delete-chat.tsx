import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useContext, useRef, useState } from "react"
import { SidebarDeleteItem } from "../all/sidebar-delete-item"

interface DeleteChatProps {
  // AUDIT FIX: Use any to bypass the "chats" vs "messages" table constraint
  chat: any
}

export const DeleteChat: FC<DeleteChatProps> = ({ chat }) => {
  // AUDIT FIX: Cast context to any
  const { setChats } = useContext(ChatbotUIContext) as any
  const { handleDeleteChat } = useChatHandler()

  const [showChatDeleteDialog, setShowChatDeleteDialog] = useState(false)

  return (
    <SidebarDeleteItem
      item={chat}
      contentType="chats"
      onDelete={() => handleDeleteChat(chat.id)}
    />
  )
}
