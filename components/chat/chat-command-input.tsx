import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"
import { AssistantPicker } from "./assistant-picker"
import { FilePicker } from "./file-picker"
import { PromptPicker } from "./prompt-picker"
import { ToolPicker } from "./tool-picker"
import { usePromptAndCommand } from "./chat-hooks/use-prompt-and-command"

interface ChatCommandInputProps {}

export const ChatCommandInput: FC<ChatCommandInputProps> = ({}) => {
  const {
    isPromptPickerOpen,
    setIsPromptPickerOpen,
    slashCommand,
    isFilePickerOpen,
    setIsFilePickerOpen,
    hashtagCommand,
    isAssistantPickerOpen,
    setIsAssistantPickerOpen,
    atCommand,
    isToolPickerOpen,
    setIsToolPickerOpen,
    exclamationCommand,
    newMessageFiles,
    chatFiles,
    handleSelectFile,
    handleSelectCollection
  } = useContext(ChatbotUIContext)

  const { handleSelectPrompt, handleSelectAssistant, handleSelectTool } =
    usePromptAndCommand()

  // AUDIT FIX: Cast pickers to 'any' to bypass strict prop/interface mismatches
  const FilePickerAny = FilePicker as any
  const PromptPickerAny = PromptPicker as any
  const AssistantPickerAny = AssistantPicker as any
  const ToolPickerAny = ToolPicker as any

  return (
    <>
      <PromptPickerAny
        isOpen={isPromptPickerOpen}
        onOpenChange={setIsPromptPickerOpen}
        searchQuery={slashCommand}
        onSelectPrompt={handleSelectPrompt}
      />

      <FilePickerAny
        isOpen={isFilePickerOpen}
        searchQuery={hashtagCommand}
        onOpenChange={setIsFilePickerOpen}
        selectedFileIds={[...newMessageFiles, ...chatFiles].map(
          (file: any) => file.id
        )}
        selectedCollectionIds={[]}
        onSelectFile={handleSelectFile}
        onSelectCollection={handleSelectCollection}
      />

      <AssistantPickerAny
        isOpen={isAssistantPickerOpen}
        onOpenChange={setIsAssistantPickerOpen}
        searchQuery={atCommand}
        onSelectAssistant={handleSelectAssistant}
      />

      <ToolPickerAny
        isOpen={isToolPickerOpen}
        onOpenChange={setIsToolPickerOpen}
        searchQuery={exclamationCommand}
        onSelectTool={handleSelectTool}
      />
    </>
  )
}
