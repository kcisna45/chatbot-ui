import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef } from "react"

interface ToolPickerProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  searchQuery: string
  onSelectTool: (tool: any) => void
}

export const ToolPicker: FC<ToolPickerProps> = ({
  isOpen,
  onOpenChange,
  searchQuery,
  onSelectTool
}) => {
  // AUDIT FIX: Cast context to any to prevent 'tools' from being 'unknown'
  const { tools } = useContext(ChatbotUIContext) as any

  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && itemsRef.current) {
      itemsRef.current.focus()
    }
  }, [isOpen])

  // AUDIT FIX: Cast 'tool' to any within the filter and handle possible undefined tools
  const filteredTools = (tools || []).filter((tool: any) =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
  }

  if (!isOpen) return null

  return (
    <div
      ref={itemsRef}
      className="bg-background border-input absolute bottom-full left-0 z-50 mb-2 max-h-[300px] w-full overflow-auto rounded-xl border-2 p-2 shadow-lg focus:outline-none"
      tabIndex={-1}
      onBlur={() => setTimeout(() => handleOpenChange(false), 100)}
    >
      {filteredTools.length === 0 ? (
        <div className="text-muted-foreground p-2 text-sm">No tools found.</div>
      ) : (
        filteredTools.map((tool: any) => (
          <div
            key={tool.id}
            className="hover:bg-accent cursor-pointer rounded-md p-2"
            onClick={() => {
              onSelectTool(tool)
              handleOpenChange(false)
            }}
          >
            <div className="font-bold">{tool.name}</div>
            <div className="line-clamp-1 text-xs opacity-60">
              {tool.description}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
