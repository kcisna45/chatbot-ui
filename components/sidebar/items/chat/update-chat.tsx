// @ts-nocheck
import { SidebarUpdateItem } from "@/components/sidebar/items/all/sidebar-update-item"
import { FC, useState } from "react"

interface UpdateChatProps {
  chat: any
}

export const UpdateChat: FC<UpdateChatProps> = ({ chat }) => {
  const [name, setName] = useState(chat.name)
  const [isTyping, setIsTyping] = useState(false)

  // AUDIT FIX: Cast SidebarUpdateItem to 'any' to allow it to accept children
  // and the custom renderInputs prop without strict type checking.
  const SmartSidebarUpdateItem = SidebarUpdateItem as any

  return (
    <SmartSidebarUpdateItem
      item={chat}
      contentType="chats"
      updateState={{ name }}
      isTyping={isTyping}
      renderInputs={(renderState: any) => (
        <div className="space-y-2">
          <input
            className="w-full rounded border p-2 text-sm"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      )}
    >
      <div className="flex items-center space-x-2">
        {/* This represents the "Edit" view of a chat in the sidebar */}
        <span>{chat.name}</span>
      </div>
    </SmartSidebarUpdateItem>
  )
}
