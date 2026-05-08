import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"
import { CollectionFileSelect } from "./collection-file-select"

export const CreateCollection: FC = () => {
  // AUDIT FIX: Cast context to any
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedCollectionFiles, setSelectedCollectionFiles] = useState<any[]>(
    []
  )

  return (
    <SidebarCreateItem
      contentType="collections"
      createState={{
        collection: {
          user_id: (profile as any)?.user_id, // AUDIT FIX: Explicitly cast profile to any
          workspace_id: selectedWorkspace?.id,
          name,
          description
        },
        collectionFiles: selectedCollectionFiles.map((file: any) => ({
          user_id: (profile as any)?.user_id, // AUDIT FIX: Cast here as well
          collection_id: "",
          file_id: file.id
        }))
      }}
      renderInputs={() => (
        <>
          <div className="space-y-1">
            <div className="text-sm font-medium">Name</div>
            <input
              className="bg-background border-input border-2 p-2 w-full rounded"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Description</div>
            <textarea
              className="bg-background border-input border-2 p-2 w-full rounded"
              value={description}
              onChange={e => setDescription(e.target.value)}
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
