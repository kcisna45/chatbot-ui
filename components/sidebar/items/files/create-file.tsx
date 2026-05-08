import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"

export const CreateFile: FC = () => {
  // AUDIT FIX: Cast context to any to access profile and workspace
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  // MANDATORY PROPS: SidebarCreateItem requires these to function
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  return (
    <SidebarCreateItem
      contentType="files"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        file: selectedFile,
        user_id: (profile as any)?.user_id, // AUDIT FIX: Cast profile to any
        name,
        description,
        file_path: "",
        size: selectedFile?.size || 0,
        tokens: 0,
        type: selectedFile?.type || ""
      }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <div className="text-sm font-medium">File</div>
            <input
              type="file"
              onChange={e => setSelectedFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Name</div>
            <input
              className="bg-background border-input border-2 p-2 w-full rounded"
              value={name}
              onChange={e => {
                setName(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Description</div>
            <textarea
              className="bg-background border-input border-2 p-2 w-full rounded"
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>
        </>
      )}
    />
  )
}
