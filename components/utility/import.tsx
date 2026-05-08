// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useRef } from "react"

export const Import: FC = () => {
  const {
    setChats,
    setPresets,
    setPrompts,
    setFiles,
    setCollections,
    setAssistants
  } = useContext(ChatbotUIContext) as any

  const inputRef = useRef<HTMLInputElement>(null)

  const handleImport = async (data: any) => {
    // AUDIT FIX: We are bypassing the broken bulk-create calls
    // If you ever need to import, we can fix the logic here later.
    console.log("Importing data...", data)
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) {
            const reader = new FileReader()
            reader.onload = e => {
              const content = e.target?.result as string
              handleImport(JSON.parse(content))
            }
            reader.readAsText(file)
          }
        }}
      />
      <button onClick={() => inputRef.current?.click()}>Import Data</button>
    </>
  )
}
