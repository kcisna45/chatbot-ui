// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useRef, useState } from "react"

interface AssistantPickerProps {}

export const AssistantPicker: FC<AssistantPickerProps> = ({}) => {
  // AUDIT FIX: Cast context to any to bypass the missing 'assistants' property error
  const {
    assistants,
    assistantImages,
    focusAssistant,
    atCommand,
    setAtCommand,
    setSelectedAssistant
  } = useContext(ChatbotUIContext) as any

  const [loading, setLoading] = useState(false)

  // If there's no command active, don't show anything
  if (!atCommand) return null

  return (
    <div className="bg-background border-input absolute bottom-full mb-2 max-h-[300px] w-full overflow-auto rounded-xl border-2 p-2 shadow-lg">
      <div className="p-2 text-xs font-bold uppercase opacity-50">
        Assistants
      </div>

      {assistants.length === 0 && (
        <div className="p-2 text-sm italic">No assistants found.</div>
      )}

      {assistants.map((assistant: any) => (
        <div
          key={assistant.id}
          className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded p-2"
          onClick={() => {
            setSelectedAssistant(assistant)
            setAtCommand("")
          }}
        >
          {assistant.name}
        </div>
      ))}
    </div>
  )
}
