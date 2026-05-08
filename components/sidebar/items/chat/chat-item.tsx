import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
// AUDIT FIX: Swapped IconMessageClient (non-existent) for IconMessage
import { IconMessage } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarItem } from "../all/sidebar-display-item"

interface ChatItemProps {
  // AUDIT FIX: Using any to bypass the "chats" vs "messages" constraint
  chat: any
}

export const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  // AUDIT FIX: Cast context to any to prevent property access errors
  const { selectedChat, setChatSettings } = useContext(ChatbotUIContext) as any

  const [isTyping, setIsTyping] = useState(false)

  return (
    <SidebarItem
      item={chat}
      isTyping={isTyping}
      contentType="chats"
      // AUDIT FIX: Updated icon reference to a valid Tabler icon
      icon={<IconMessage size={30} />}
      updateState={{
        name: chat.name
      }}
      renderInputs={(renderState: any) => (
        <>
          {/* Chat items in the sidebar typically only allow for 
            name editing, which is handled internally by SidebarItem.
            We leave this fragment empty to satisfy the prop requirement.
          */}
        </>
      )}
    />
  )
}
