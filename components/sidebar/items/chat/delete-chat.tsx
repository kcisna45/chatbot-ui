import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { SidebarDeleteItem } from "../all/sidebar-delete-item"

interface DeleteChatProps {
  chat: any
}

export const DeleteChat: FC<DeleteChatProps> = ({ chat }) => {
  // AUDIT FIX: Access the context and handler
  const context = useContext(ChatbotUIContext) as any

  // Create a safe wrapper for the delete action
  const handleInternalDelete = async () => {
    if (!chat?.id) return

    // Check which delete function the context actually provides
    const deleteFn = context.handleDeleteChat || context.deleteChat

    if (deleteFn) {
      await deleteFn(chat.id)
    }
  }

  return (
    <SidebarDeleteItem
      item={chat}
      contentType="chats"
      onDelete={handleInternalDelete}
    />
  )
}
