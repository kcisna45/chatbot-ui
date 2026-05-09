// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"

export const CreateTool: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")
  const [customHeaders, setCustomHeaders] = useState("")
  const [schema, setSchema] = useState("")

  return (
    <SidebarCreateItem
      contentType="tools"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        user_id: profile?.user_id,
        workspace_id: selectedWorkspace?.id,
        name,
        description,
        url,
        custom_headers: customHeaders,
        schema
      }}
      renderInputs={() => (
        <div className="space-y-1">
          <div className="text-sm font-medium">Name</div>
          <input
            className="bg-background border-input w-full rounded border-2 p-2"
            value={name}
            onChange={e => {
              setName(e.target.value)
              setIsTyping(true)
            }}
            onBlur={() => setIsTyping(false)}
          />
        </div>
      )}
    />
  )
}
