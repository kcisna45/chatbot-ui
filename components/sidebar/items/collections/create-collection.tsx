import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"
import { CollectionFileSelect } from "./collection-file-select"

export const CreateCollection: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  // MANDATORY PROPS FOR SIDEBARCREATEITEM
  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCollectionFiles, setSelectedCollectionFiles] = useState<any[]>(
    []
  )

  return (
    <SidebarCreateItem
      contentType="collections"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        collection: {
          user_id: (profile as any)?.user_id,
          workspace_id: selectedWorkspace?.id,
          name,
          description
        },
        collectionFiles: selectedCollectionFiles.map((file: any) => ({
          user_id: (profile as any)?.user_id,
          collection_id: "",
          file_id: file.id
        }))
      }}
      renderInputs={() => (
        <>
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

          <div className="space-y-1">
            <div className="text-sm font-medium">Description</div>
            <textarea
              className="bg-background border-input w-full rounded border-2 p-2"
              value={description}
              onChange={e => {
                setDescription(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>

          <CollectionFileSelect
            selectedCollectionFiles={selectedCollectionFiles}
            onCollectionFileSelect={(file: any) => {
              setSelectedCollectionFiles(prev =>
                prev.some(f => f.id === file.id)
                  ? prev.filter(f => f.id !== file.id)
                  : [...prev, file]
              )
            }}
          />
        </>
      )}
    />
  )
}
