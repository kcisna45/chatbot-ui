// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useEffect, useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"

export const CommandK: FC = () => {
  const { profile, selectedWorkspace } = useContext(ChatbotUIContext) as any
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Command logic here
    }
  }

  if (!profile) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        onKeyDown={handleKeyDown}
        className="border-none bg-transparent p-0"
      >
        <div className="bg-background border-input flex w-full flex-col overflow-hidden rounded-lg border-2 shadow-lg">
          <input
            className="border-b bg-transparent p-4 outline-none"
            placeholder="Search or type a command..."
            autoFocus
          />

          <div className="max-h-[300px] overflow-auto p-2">
            {profile?.openai_api_key ? (
              <div className="text-muted-foreground p-2 text-xs font-bold uppercase">
                AI Search Enabled
              </div>
            ) : (
              <div className="text-muted-foreground p-2 text-xs font-bold uppercase">
                Standard Search
              </div>
            )}
            {/* Search results would map here */}
            <div className="hover:bg-accent cursor-pointer rounded p-2">
              Search Chats...
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
