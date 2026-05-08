import { ChatbotUIContext } from "@/context/context"
import { IconEdit } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
import { SidebarUpdateItem } from "../all/sidebar-update-item"

interface UpdateChatProps {
  chat: any
}

export const UpdateChat: FC<UpdateChatProps> = ({ chat }) => {
  const { setChats } = useContext(ChatbotUIContext) as any

  // MANDATORY: SidebarUpdateItem requires isTyping state
  const [isTyping, setIsTyping] = useState(false)
  const [name, setName] = useState(chat.name)

  return (
    <SidebarUpdateItem
      item={chat}
      contentType="chats"
      updateState={{
        name
      }}
      isTyping={isTyping} // Added missing prop
      renderInputs={(renderState: any) => (
        <div onKeyDown={e => e.stopPropagation()}>
          <div className="space-y-1">
            {/* Standard name edit field for chats */}
            <input
              className="bg-background border-input border-2 p-2 w-full rounded"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>
        </div>
      )}
    >
      {/* MANDATORY: SidebarUpdateItem requires children to act as the trigger */}
      <IconEdit className="hover:opacity-50 cursor-pointer" size={18} />
    </SidebarUpdateItem>
  )
}
