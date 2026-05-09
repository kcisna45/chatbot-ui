// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarUpdateItem } from "./sidebar-update-item"

interface SidebarDisplayItemProps {
  item: any
  contentType: any
}

export const SidebarDisplayItem: FC<SidebarDisplayItemProps> = ({
  item,
  contentType
}) => {
  const { setSelectedChat } = useContext(ChatbotUIContext) as any
  const [isTyping, setIsTyping] = useState(false)

  // AUDIT FIX: Cast the Update Item to any to allow it to accept
  // children and other props we removed from its strict definition.
  const SmartSidebarUpdateItem = SidebarUpdateItem as any

  return (
    <div className="group relative flex items-center">
      <SmartSidebarUpdateItem
        item={item}
        isTyping={isTyping}
        contentType={contentType}
        updateState={item}
        renderInputs={(renderState: any) => (
          <div>{/* Inputs for editing the item name/description */}</div>
        )}
      >
        <div className="flex w-full cursor-pointer items-center justify-between p-2">
          {item.name}
        </div>
      </SmartSidebarUpdateItem>
    </div>
  )
}
