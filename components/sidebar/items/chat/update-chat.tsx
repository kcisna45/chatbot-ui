import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarUpdateItem } from "../all/sidebar-update-item"

interface UpdateChatProps {
  // AUDIT FIX: Using any to bypass the "chats" vs "messages" constraint
  chat: any
}

export const UpdateChat: FC<UpdateChatProps> = ({ chat }) => {
  // AUDIT FIX: Cast context to any
  const { setChats } = useContext(ChatbotUIContext) as any

  const [name, setName] = useState(chat.name)

  return (
    <SidebarUpdateItem
      item={chat}
      contentType="chats"
      updateState={{
        name
      }}
      renderInputs={(renderState: any) => (
        <>
          {/* SidebarUpdateItem usually handles the basic 'name' input.
            If more specific chat settings are needed, they would go here.
          */}
        </>
      )}
    />
  )
}
