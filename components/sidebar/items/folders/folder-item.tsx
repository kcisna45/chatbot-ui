// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { SidebarItem } from "../all/sidebar-display-item"

interface FolderProps {
  folder: any
  contentType: ContentType
  children: React.ReactNode
  onUpdateFolder: (itemId: string, folderId: string | null) => void
}

export const FolderItem: FC<FolderProps> = ({
  folder,
  contentType,
  children,
  onUpdateFolder
}) => {
  const { setFolders } = useContext(ChatbotUIContext) as any

  return (
    <SidebarItem
      item={folder}
      contentType={contentType}
      icon={null}
      updateState={{
        name: folder.name
      }}
    >
      {children}
    </SidebarItem>
  )
}
