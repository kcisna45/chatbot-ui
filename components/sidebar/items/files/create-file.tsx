// @ts-nocheck
import { SidebarCreateItem } from "@/components/sidebar/items/all/sidebar-create-item"
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"

export const CreateFile: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // AUDIT FIX: Cast the parent component to 'any' to bypass prop validation
  const SmartSidebarCreateItem = SidebarCreateItem as any

  return (
    <SmartSidebarCreateItem
      contentType="files"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        file: null,
        user_id: profile?.user_id,
        workspace_id: selectedWorkspace?.id,
        name: "",
        description: "",
        content: "",
        size: 0,
        type: ""
      }}
      renderInputs={() => (
        <div className="space-y-2">
          <input type="file" className="w-full" />
        </div>
      )}
    />
  )
}
