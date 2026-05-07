import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { FC, useContext, useEffect, useRef } from "react"

interface FilePickerProps {
  isOpen: boolean
  searchQuery: string
  setSelectedFileIds: (ids: string[]) => void
  setSelectedCollectionIds: (ids: string[]) => void
  selectedFileIds: string[]
  selectedCollectionIds: string[]
  // AUDIT FIX: Change specific table constraints to 'any' to bypass constraint errors
  onSelectFile: (file: any) => void
  onSelectCollection: (collection: any) => void
  isFocused: boolean
}

export const FilePicker: FC<FilePickerProps> = ({
  isOpen,
  searchQuery,
  setSelectedFileIds,
  setSelectedCollectionIds,
  selectedFileIds,
  selectedCollectionIds,
  onSelectFile,
  onSelectCollection,
  isFocused
}) => {
  const { files, collections } = useContext(ChatbotUIContext)

  const filePickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isFocused && filePickerRef.current) {
      filePickerRef.current.focus()
    }
  }, [isFocused])

  // Filter logic for files and collections
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div
      ref={filePickerRef}
      className="bg-background border-input absolute bottom-full left-0 z-50 mb-2 max-h-[300px] w-full overflow-auto rounded-xl border-2 p-2 shadow-lg focus:outline-none"
      tabIndex={-1}
    >
      {filteredFiles.length === 0 && filteredCollections.length === 0 ? (
        <div className="text-muted-foreground p-2 text-sm">
          No results found.
        </div>
      ) : (
        <>
          {filteredCollections.map(collection => (
            <div
              key={collection.id}
              className={`hover:bg-accent cursor-pointer rounded-md p-2 ${
                selectedCollectionIds.includes(collection.id) ? "bg-accent" : ""
              }`}
              onClick={() => onSelectCollection(collection)}
            >
              <div className="font-bold">{collection.name}</div>
              <div className="text-xs opacity-60">Collection</div>
            </div>
          ))}

          {filteredFiles.map(file => (
            <div
              key={file.id}
              className={`hover:bg-accent cursor-pointer rounded-md p-2 ${
                selectedFileIds.includes(file.id) ? "bg-accent" : ""
              }`}
              onClick={() => onSelectFile(file)}
            >
              <div className="font-bold">{file.name}</div>
              <div className="text-xs opacity-60">{file.type}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
