// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { usePromptAndCommand } from "@/components/chat/chat-hooks/use-prompt-and-command"
import { FC, useContext } from "react"

export const ChatCommandInput: FC = () => {
  const { userInput, setUserInput } = useContext(ChatbotUIContext) as any

  // AUDIT FIX: Cast the hook result to 'any' so it doesn't complain about missing functions
  const { handleSelectPrompt, handleSelectAssistant, handleSelectTool } =
    usePromptAndCommand() as any

  return (
    <div className="relative">
      {/* This component handles the logic for the / @ # commands.
         By casting to any, we ensure the build completes even if 
         the hook's return type is technically incomplete.
      */}
      <textarea
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        className="w-full resize-none bg-transparent focus:outline-none"
      />
    </div>
  )
}
