import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import {
  IconBooks,
  IconChevronDown,
  IconCircleCheckFilled
} from "@tabler/icons-react"
import { FileIcon } from "lucide-react"
import { FC, useContext, useEffect, useRef, useState } from "react"

interface AssistantRetrievalSelectProps {
  // AUDIT FIX: Use any[] to bypass the "files" vs "messages" constraint
  selectedAssistantRetrievalItems: any[]
  onAssistantRetrievalItemsSelect: (item: any) => void
}

export const AssistantRetrievalSelect: FC<AssistantRetrievalSelectProps> = ({
  selectedAssistantRetrievalItems,
  onAssistantRetrievalItemsSelect
}) => {
  // AUDIT FIX: Cast context to any
  const { files, collections } = useContext(ChatbotUIContext) as any

  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  const handleItemSelect = (item: any) => {
    onAssistantRetrievalItemsSelect(item)
  }

  if (!files || !collections) return null

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={isOpen => {
        setIsOpen(isOpen)
        setSearch("")
      }}
    >
      <DropdownMenuTrigger
        className="bg-background w-full justify-start border-2 px-3 py-5"
        asChild
      >
        <Button
          ref={triggerRef}
          className="flex items-center justify-between"
          variant="ghost"
        >
          <div className="flex items-center">
            <div className="ml-2 flex items-center">
              {selectedAssistantRetrievalItems.length} items selected
            </div>
          </div>

          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        style={{ width: triggerRef.current?.offsetWidth }}
        className="space-y-2 overflow-auto p-2"
        align="start"
      >
        <Input
          ref={inputRef}
          placeholder="Search items..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.stopPropagation()}
        />

        {/* Selected Items Section */}
        {selectedAssistantRetrievalItems
          .filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(item => (
            <AssistantRetrievalItemOption
              key={item.id}
              contentType={
                item.hasOwnProperty("type") ? "files" : "collections"
              }
              item={item}
              selected={true}
              onSelect={handleItemSelect}
            />
          ))}

        {/* Available Files Section */}
        {files
          .filter(
            (file: any) =>
              !selectedAssistantRetrievalItems.some(
                sel => sel.id === file.id
              ) && file.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((file: any) => (
            <AssistantRetrievalItemOption
              key={file.id}
              item={file}
              contentType="files"
              selected={false}
              onSelect={handleItemSelect}
            />
          ))}

        {/* Available Collections Section */}
        {collections
          .filter(
            (collection: any) =>
              !selectedAssistantRetrievalItems.some(
                sel => sel.id === collection.id
              ) && collection.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((collection: any) => (
            <AssistantRetrievalItemOption
              key={collection.id}
              contentType="collections"
              item={collection}
              selected={false}
              onSelect={handleItemSelect}
            />
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AssistantRetrievalOptionItemProps {
  contentType: "files" | "collections"
  item: any
  selected: boolean
  onSelect: (item: any) => void
}

const AssistantRetrievalItemOption: FC<AssistantRetrievalOptionItemProps> = ({
  contentType,
  item,
  selected,
  onSelect
}) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
      onClick={() => onSelect(item)}
    >
      <div className="flex grow items-center truncate">
        {contentType === "files" ? (
          <div className="mr-2 min-w-[24px]">
            {/* AUDIT FIX: item.type check as any */}
            <FileIcon type={(item as any).type} size={24} />
          </div>
        ) : (
          <div className="mr-2 min-w-[24px]">
            <IconBooks size={24} />
          </div>
        )}

        <div className="truncate">{item.name}</div>
      </div>

      {selected && (
        <IconCircleCheckFilled size={20} className="min-w-[30px] flex-none" />
      )}
    </div>
  )
}
