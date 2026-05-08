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
        className="p-0 border-none bg-transparent"
      >
        <div className="bg-background border-input border-2 flex flex-col w-full rounded-lg overflow-hidden shadow-lg">
          <input
            className="p-4 bg-transparent outline-none border-b"
            placeholder="Search or type a command..."
            autoFocus
          />

          <div className="p-2 max-h-[300px] overflow-auto">
            {profile?.openai_api_key ? (
              <div className="p-2 text-xs text-muted-foreground uppercase font-bold">
                AI Search Enabled
              </div>
            ) : (
              <div className="p-2 text-xs text-muted-foreground uppercase font-bold">
                Standard Search
              </div>
            )}
            {/* Search results would map here */}
            <div className="p-2 hover:bg-accent cursor-pointer rounded">
              Search Chats...
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
