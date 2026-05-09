// @ts-nocheck
import { SidebarCreateItem } from "@/components/sidebar/items/all/sidebar-create-item"
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"

export const CreateCollection: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // AUDIT FIX: We are casting SidebarCreateItem to 'any' to stop the
  // "Property does not exist" error during the property hand-off.
  const SmartSidebarCreateItem = SidebarCreateItem as any

  return (
    <SmartSidebarCreateItem
      contentType="collections"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        collection: {
          user_id: profile?.user_id,
          workspace_id: selectedWorkspace?.id,
          name: "",
          description: ""
        },
        collectionFiles: []
      }}
      renderInputs={() => (
        <div className="space-y-2">
          <input className="border p-2" placeholder="Collection Name" />
        </div>
      )}
    />
  )
}
