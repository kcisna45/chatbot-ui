import { ChatSettingsForm } from "@/components/ui/chat-settings-form"
import ImagePicker from "@/components/ui/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { ASSISTANT_DESCRIPTION_MAX, ASSISTANT_NAME_MAX } from "@/db/limits"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"
import { AssistantRetrievalSelect } from "./assistant-retrieval-select"
import { AssistantToolSelect } from "./assistant-tool-select"

export const CreateAssistant: FC = () => {
  const { selectedWorkspace, profile } = useContext(ChatbotUIContext) as any

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [assistantChatSettings, setAssistantChatSettings] = useState({
    model: selectedWorkspace?.default_model,
    prompt: selectedWorkspace?.default_prompt,
    temperature: selectedWorkspace?.default_temperature,
    contextLength: selectedWorkspace?.default_context_length,
    includeProfileContext: selectedWorkspace?.include_profile_context,
    includeWorkspaceInstructions:
      selectedWorkspace?.include_workspace_instructions
  })

  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imageLink, setImageLink] = useState("")

  // AUDIT FIX: Manage retrieval state locally since SidebarCreateItem
  // expects renderInputs to take 0 arguments.
  const [selectedAssistantFiles, setSelectedAssistantFiles] = useState<any[]>(
    []
  )
  const [selectedAssistantCollections, setSelectedAssistantCollections] =
    useState<any[]>([])
  const [selectedAssistantTools, setSelectedAssistantTools] = useState<any[]>(
    []
  )

  const handleFileSelect = (file: any) => {
    setSelectedAssistantFiles(prev =>
      prev.find(f => f.id === file.id)
        ? prev.filter(f => f.id !== file.id)
        : [...prev, file]
    )
  }

  const handleCollectionSelect = (collection: any) => {
    setSelectedAssistantCollections(prev =>
      prev.find(c => c.id === collection.id)
        ? prev.filter(c => c.id !== collection.id)
        : [...prev, collection]
    )
  }

  const handleToolSelect = (tool: any) => {
    setSelectedAssistantTools(prev =>
      prev.find(t => t.id === tool.id)
        ? prev.filter(t => t.id !== tool.id)
        : [...prev, tool]
    )
  }

  if (!profile) return null

  return (
    <SidebarCreateItem
      contentType="assistants"
      createState={{
        image: selectedImage,
        user_id: profile.user_id,
        name,
        description,
        include_profile_context: assistantChatSettings.includeProfileContext,
        include_workspace_instructions:
          assistantChatSettings.includeWorkspaceInstructions,
        context_length: assistantChatSettings.contextLength,
        model: assistantChatSettings.model,
        image_path: "",
        prompt: assistantChatSettings.prompt,
        temperature: assistantChatSettings.temperature,
        // Manually adding these to the createState
        selectedAssistantFiles,
        selectedAssistantCollections,
        selectedAssistantTools
      }}
      renderInputs={() => (
        // AUDIT FIX: Now taking 0 arguments to match Target Signature
        <>
          <div className="space-y-1">
            <Label>Name</Label>
            <Input
              placeholder="Assistant name..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={ASSISTANT_NAME_MAX}
            />
          </div>

          <div className="space-y-1 pt-2">
            <Label>Description</Label>
            <Input
              placeholder="Assistant description..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              maxLength={ASSISTANT_DESCRIPTION_MAX}
            />
          </div>

          <div className="space-y-1">
            <Label>Image</Label>
            <ImagePicker
              src={imageLink}
              image={selectedImage}
              onSrcChange={setImageLink}
              onImageChange={setSelectedImage}
              width={100}
              height={100}
            />
          </div>

          <ChatSettingsForm
            chatSettings={assistantChatSettings as any}
            onChangeChatSettings={setAssistantChatSettings}
            useAdvancedDropdown={true}
          />

          <div className="space-y-1 pt-2">
            <Label>Files & Collections</Label>
            <AssistantRetrievalSelect
              selectedAssistantRetrievalItems={[
                ...selectedAssistantFiles,
                ...selectedAssistantCollections
              ]}
              onAssistantRetrievalItemsSelect={(item: any) =>
                "type" in item
                  ? handleFileSelect(item)
                  : handleCollectionSelect(item)
              }
            />
          </div>

          <div className="space-y-1">
            <Label>Tools</Label>
            <AssistantToolSelect
              selectedAssistantTools={selectedAssistantTools}
              onAssistantToolsSelect={(tool: any) => handleToolSelect(tool)}
            />
          </div>
        </>
      )}
    />
  )
}
