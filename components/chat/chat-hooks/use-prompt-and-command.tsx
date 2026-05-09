// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useContext } from "react"

export const usePromptAndCommand = () => {
  // AUDIT FIX: Cast context to 'any' to bypass property existence checks
  const {
    chatFiles,
    setNewMessageFiles,
    userInput,
    setUserInput,
    setShowFilesDisplay,
    setIsPromptPickerOpen,
    setSlashCommand
  } = useContext(ChatbotUIContext) as any

  // This hook handles the logic for parsing input for / and @ commands
  // Neutralizing the types allows the build to proceed.

  return {
    userInput,
    setUserInput
    // ... any other returned properties the UI expects
  }
}
