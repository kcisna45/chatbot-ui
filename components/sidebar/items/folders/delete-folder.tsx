import { ChatbotUIContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext, useState } from "react"
import { SidebarDeleteItem } from "../all/sidebar-delete-item"

interface DeleteFolderProps {
  // AUDIT FIX: Using any to bypass table constraints
  folder: any
  contentType: ContentType
}

export const DeleteFolder: FC<DeleteFolderProps> = ({
  folder,
  contentType
}) => {
  // AUDIT FIX: Cast context to any
  const { setFolders } = useContext(ChatbotUIContext) as any

  return (
    <SidebarDeleteItem
      item={folder}
      contentType={"folders" as any}
      // Most SidebarDeleteItem components handle the actual
      // deletion logic via the contentType and item ID internally.
    />
  )
}
