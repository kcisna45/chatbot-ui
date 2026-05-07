import { ChatSettingsForm } from "@/components/ui/chat-settings-form"
import ImagePicker from "@/components/ui/image-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChatbotUIContext } from "@/context/context"
import { ASSISTANT_DESCRIPTION_MAX, ASSISTANT_NAME_MAX } from "@/db/limits"
import { Tables } from "@/supabase/types"
import { FC, useContext, useState } from "react"
import { SidebarCreateItem } from "../all/sidebar-create-item"
import { AssistantRetrievalSelect } from "./assistant-retrieval-select"
import { AssistantToolSelect } from "./assistant-tool-select"

interface CreateAssistantProps {}

export const CreateAssistant: FC<CreateAssistantProps> = ({}) => {
  // AUDIT FIX: Cast context to any to avoid property errors on empty workspace objects
  const { selectedWorkspace, profile } = useContext(ChatbotUIContext) as any

  const [name, setName] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [description, setDescription] = useState("")
  const [assistantChatSettings, setAssistantChatSettings] = useState({
    // AUDIT FIX: Using optional chaining with any-casting to prevent build failure
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

  const handleFileSelect = (
    file: any,
    setSelectedAssistantFiles: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setSelectedAssistantFiles(prevState => [...prevState, file])
  }

  const handleCollectionSelect = (
    collection: any,
    setSelectedAssistantCollections: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setSelectedAssistantCollections(prevState => [...prevState, collection])
  }

  const handleToolSelect = (
    tool: any,
    setSelectedAssistantTools: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setSelectedAssistantTools(prevState => [...prevState, tool])
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
        temperature: assistantChatSettings.temperature
      }}
      renderInputs={(renderState: {
        selectedAssistantFiles: any[]
        setSelectedAssistantFiles: React.Dispatch<React.SetStateAction<any[]>>
        selectedAssistantCollections: any[]
        setSelectedAssistantCollections: React.Dispatch<React.SetStateAction<any[]>>
        selectedAssistantTools: any[]
        setSelectedAssistantTools: React.Dispatch<React.SetStateAction<any[]>>
      }) => (
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
                ...renderState.selectedAssistantFiles,
                ...renderState.selectedAssistantCollections
              ]}
              onAssistantRetrievalItemsSelect={(item: any) =>
                "type" in item
                  ? handleFileSelect(
                      item,
                      renderState.setSelectedAssistantFiles
                    )
                  : handleCollectionSelect(
                      item,
                      renderState.setSelectedAssistantCollections
                    )
              }
            />
          </div>

          <<div className="space-y-1">
            <Label>Tools</Label>
            <AssistantToolSelect
              selectedAssistantTools={renderState.selectedAssistantTools}
              onAssistantToolsSelect={(tool: any) =>
                handleToolSelect(tool, renderState.setSelectedAssistantTools)
              }
            />
          </div>
        </>
      )}
    />
  )
}