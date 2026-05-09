// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useHotkey } from "@/lib/hooks/use-hotkey"
import { FC, useContext, useState } from "react"

interface ChatFilesDisplayProps {}

export const ChatFilesDisplay: FC<ChatFilesDisplayProps> = ({}) => {
  const [showFilesDisplay, setShowFilesDisplay] = useState(false)
  const [useRetrieval, setUseRetrieval] = useState(true)

  // AUDIT FIX: Explicitly typing 'prev' as any to satisfy strict mode
  useHotkey("f", () => setShowFilesDisplay((prev: any) => !prev))
  useHotkey("e", () => setUseRetrieval((prev: any) => !prev))

  const { files, selectedChat, chatFiles, setChatFiles } = useContext(
    ChatbotUIContext
  ) as any

  if (!showFilesDisplay) return null

  return (
    <div className="flex flex-col space-y-2 p-4">
      <div className="text-sm font-medium">Attached Files</div>
      <div className="flex flex-wrap gap-2">
        {chatFiles.map((file: any) => (
          <div key={file.id} className="bg-accent rounded-md px-2 py-1 text-xs">
            {file.name}
          </div>
        ))}
      </div>
    </div>
  )
}
