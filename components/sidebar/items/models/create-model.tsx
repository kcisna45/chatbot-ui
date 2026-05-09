// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"

export const CreateModel: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any

  const [isOpen, setIsOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [modelId, setModelId] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [contextLength, setContextLength] = useState(4096)

  return (
    <SidebarCreateItem
      contentType="models"
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      isTyping={isTyping}
      createState={{
        user_id: profile?.user_id,
        name,
        description,
        model_id: modelId,
        base_url: baseUrl,
        api_key: apiKey,
        context_length: contextLength
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
            <div className="text-sm font-medium">Model ID</div>
            <input
              className="bg-background border-input w-full rounded border-2 p-2"
              placeholder="gpt-4-turbo"
              value={modelId}
              onChange={e => setModelId(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">Base URL</div>
            <input
              className="bg-background border-input w-full rounded border-2 p-2"
              value={baseUrl}
              onChange={e => setBaseUrl(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium">API Key</div>
            <input
              type="password"
              className="bg-background border-input w-full rounded border-2 p-2"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
            />
          </div>
        </>
      )}
    />
  )
}
