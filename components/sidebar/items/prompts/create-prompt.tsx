// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"

export const CreatePrompt: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [content, setContent] = useState("")
  const [description, setDescription] = useState("")

  return (
    <SidebarCreateItem
      contentType="prompts"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        user_id: profile?.user_id,
        workspace_id: selectedWorkspace?.id,
        name,
        content,
        description
      }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <div className="text-sm font-medium">Name</div>
            <input
              className="bg-background border-input border-2 p-2 w-full rounded"
              placeholder="Prompt name..."
              value={name}
              onChange={e => {
                setName(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Content</div>
            <textarea
              className="bg-background border-input border-2 p-2 w-full rounded"
              placeholder="Prompt content..."
              value={content}
              onChange={e => {
                setContent(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
              rows={6}
            />
          </div>
        </>
      )}
    />
  )
}
