import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef } from "react"

interface PromptPickerProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
  searchQuery: string
  onSelectPrompt: (prompt: any) => void
}

export const PromptPicker: FC<PromptPickerProps> = ({
  isOpen,
  onOpenChange,
  searchQuery,
  onSelectPrompt
}) => {
  // AUDIT FIX: Cast context to any to prevent 'prompts' from being 'unknown'
  const { prompts } = useContext(ChatbotUIContext) as any

  const itemsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && itemsRef.current) {
      itemsRef.current.focus()
    }
  }, [isOpen])

  // AUDIT FIX: Cast 'prompt' to any within the filter
  const filteredPrompts = (prompts || []).filter((prompt: any) =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase())
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
      {filteredPrompts.length === 0 ? (
        <div className="text-muted-foreground p-2 text-sm">
          No prompts found.
        </div>
      ) : (
        filteredPrompts.map((prompt: any) => (
          <div
            key={prompt.id}
            className="hover:bg-accent cursor-pointer rounded-md p-2"
            onClick={() => {
              onSelectPrompt(prompt)
              handleOpenChange(false)
            }}
          >
            <div className="font-bold">{prompt.name}</div>
            <div className="text-xs opacity-60 line-clamp-1">
              {prompt.content}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
