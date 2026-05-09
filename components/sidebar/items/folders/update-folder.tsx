// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarUpdateItem } from "../all/sidebar-update-item"

interface UpdateFolderProps {
  folder: any
}

export const UpdateFolder: FC<UpdateFolderProps> = ({ folder }) => {
  const { setFolders } = useContext(ChatbotUIContext) as any
  const [name, setName] = useState(folder.name)

  return (
    <SidebarUpdateItem
      item={folder}
      contentType="folders"
      updateState={{
        name
      }}
      renderInputs={() => (
        <div className="space-y-1">
          <div className="text-sm font-medium">Name</div>
          <input
            className="bg-background border-input w-full rounded border-2 p-2"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
      )}
    />
  )
}
