// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconMessage } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
// AUDIT FIX: Import SidebarDisplayItem instead of the non-existent SidebarItem
import { SidebarDisplayItem } from "../all/sidebar-display-item"

interface ChatItemProps {
  chat: any
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { setSelectedChat } = useContext(ChatbotUIContext) as any

  // AUDIT FIX: Use SidebarDisplayItem as the base
  return (
    <SidebarDisplayItem item={chat} contentType="chats">
      <div className="flex items-center space-x-3">
        <IconMessage size={18} />
        <div className="truncate text-sm">{chat.name}</div>
      </div>
    </SidebarDisplayItem>
  )
}
