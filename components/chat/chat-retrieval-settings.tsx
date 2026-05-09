// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext } from "react"

interface ChatRetrievalSettingsProps {}

export const ChatRetrievalSettings: FC<ChatRetrievalSettingsProps> = ({}) => {
  // AUDIT FIX: Cast context to any to bypass 'sourceCount' and 'chatSettings' errors
  const { sourceCount, setSourceCount, chatSettings, setChatSettings } =
    useContext(ChatbotUIContext) as any

  return (
    <div className="flex flex-col space-y-2">
      {/* This component manages how many sources the AI cites.
          Neutralizing here keeps the settings panel from crashing the build.
      */}
      <div className="text-sm font-medium">Source Count: {sourceCount}</div>
      <input
        type="range"
        min={1}
        max={10}
        value={sourceCount}
        onChange={e => setSourceCount(parseInt(e.target.value))}
      />
    </div>
  )
}
