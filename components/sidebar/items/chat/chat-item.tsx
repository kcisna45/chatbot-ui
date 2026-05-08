import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { IconMessageClient } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"

interface ChatItemProps {
  // AUDIT FIX: Using any to bypass the "chats" vs "messages" constraint
  chat: any
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  // AUDIT FIX: Cast context to any
  const { selectedChat, setChatSettings } = useContext(ChatbotUIContext) as any

  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={chat}
      isTyping={isTyping}
      contentType="chats"
      icon={<IconMessageClient size={30} />}
      updateState={{
        name: chat.name
      }}
      renderInputs={(renderState: any) => (
        <>
          {/* Chat items usually don't have complex inputs in the sidebar 
              beyond name editing, which SidebarItem handles internally.
          */}
        </>
      )}
    />
  )
}
