import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"

interface CollectionFileSelectProps {
  selectedCollectionFiles: any[]
  onCollectionFileSelect: (file: any) => void
}

export const CollectionFileSelect: FC<CollectionFileSelectProps> = ({
  selectedCollectionFiles,
  onCollectionFileSelect
}) => {
  const { files } = useContext(ChatbotUIContext) as any
  const [search, setSearch] = useState("")

  // Filter files based on search text
  const filteredFiles = files.filter((file: any) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-2">
      <Label>Files</Label>

      <Input
        placeholder="Search files..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto border rounded-md p-2">
        {filteredFiles.map((file: any) => {
          const isSelected = selectedCollectionFiles.some(
            (selectedFile: any) => selectedFile.id === file.id
          )

          return (
            <div
              key={file.id}
              className={`flex items-center justify-between p-2 cursor-pointer rounded hover:bg-accent ${
                isSelected ? "bg-accent" : ""
              }`}
              onClick={() => onCollectionFileSelect(file)}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  className="cursor-pointer"
                />
                <div className="text-sm truncate w-[200px]">{file.name}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
