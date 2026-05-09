// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { IconPackage } from "@tabler/icons-react"
import { FC, useContext, useState } from "react"
// AUDIT FIX: Point to the correct exported member SidebarDisplayItem
import { SidebarDisplayItem } from "../all/sidebar-display-item"

interface CollectionItemProps {
  collection: any
}

export const CollectionItem: FC<CollectionItemProps> = ({ collection }) => {
  const { setSelectedChat } = useContext(ChatbotUIContext) as any

  // This handles the visual row for a Collection in the sidebar.
  return (
    <SidebarDisplayItem item={collection} contentType="collections">
      <div className="flex items-center space-x-3">
        <IconPackage size={18} />
        <div className="truncate text-sm">{collection.name}</div>
      </div>
    </SidebarDisplayItem>
  )
}
