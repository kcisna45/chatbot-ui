// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"

export const CreatePreset: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [model, setModel] = useState("gpt-4-turbo")
  const [prompt, setPrompt] = useState("")
  const [temperature, setTemperature] = useState(0.5)

  return (
    <SidebarCreateItem
      contentType="presets"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        user_id: profile?.user_id,
        workspace_id: selectedWorkspace?.id,
        name,
        description,
        model,
        prompt,
        temperature,
        context_length: 4096,
        include_profile_context: true,
        include_workspace_instructions: true
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
            <div className="text-sm font-medium">Prompt</div>
            <textarea
              className="bg-background border-input w-full rounded border-2 p-2"
              placeholder="System prompt for this preset..."
              value={prompt}
              onChange={e => {
                setPrompt(e.target.value)
                setIsTyping(true)
              }}
              onBlur={() => setIsTyping(false)}
            />
          </div>
        </>
      )}
    />
  )
}
