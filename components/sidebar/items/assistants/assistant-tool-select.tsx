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
  IconChevronDown,
  IconCircleCheckFilled,
  IconTools
} from "@tabler/icons-react"
import { FC, useContext, useEffect, useRef, useState } from "react"

interface AssistantToolSelectProps {
  // AUDIT FIX: Use any[] to bypass the "tools" vs "messages" constraint
  selectedAssistantTools: any[]
  onAssistantToolsSelect: (tool: any) => void
}

export const AssistantToolSelect: FC<AssistantToolSelectProps> = ({
  selectedAssistantTools,
  onAssistantToolsSelect
}) => {
  // AUDIT FIX: Cast context to any
  const { tools } = useContext(ChatbotUIContext) as any

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

  const handleToolSelect = (tool: any) => {
    onAssistantToolsSelect(tool)
  }

  if (!tools) return null

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
              {selectedAssistantTools.length} tools selected
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
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.stopPropagation()}
        />

        {/* Selected Tools Section */}
        {selectedAssistantTools
          .filter(tool =>
            tool.name.toLowerCase().includes(search.toLowerCase())
          )
          .map(tool => (
            <div
              key={tool.id}
              className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
              onClick={() => handleToolSelect(tool)}
            >
              <div className="flex grow items-center truncate">
                <div className="mr-2 min-w-[24px]">
                  <IconTools size={24} />
                </div>
                <div className="truncate">{tool.name}</div>
              </div>
              <IconCircleCheckFilled
                size={20}
                className="min-w-[30px] flex-none"
              />
            </div>
          ))}

        {/* Available Tools Section */}
        {tools
          .filter(
            (tool: any) =>
              !selectedAssistantTools.some(
                selectedTool => selectedTool.id === tool.id
              ) && tool.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((tool: any) => (
            <div
              key={tool.id}
              className="flex cursor-pointer items-center justify-between py-0.5 hover:opacity-50"
              onClick={() => handleToolSelect(tool)}
            >
              <div className="flex grow items-center truncate">
                <div className="mr-2 min-w-[24px]">
                  <IconTools size={24} />
                </div>
                <div className="truncate">{tool.name}</div>
              </div>
            </div>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
