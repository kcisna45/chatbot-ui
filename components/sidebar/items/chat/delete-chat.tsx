import { FC } from "react"
import { SidebarDeleteItem } from "../all/sidebar-delete-item"

interface DeleteChatProps {
  chat: any
}

export const DeleteChat: FC<DeleteChatProps> = ({ chat }) => {
  return <SidebarDeleteItem item={chat} contentType="chats" />
}
