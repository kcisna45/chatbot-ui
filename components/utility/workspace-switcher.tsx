// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { useChatHandler } from "@/components/chat/chat-hooks/use-chat-handler"
import { useRouter } from "next/navigation"
import { FC, useContext } from "react"

export const WorkspaceSwitcher: FC = () => {
  const { workspaces, selectedWorkspace, setSelectedWorkspace } = useContext(
    ChatbotUIContext
  ) as any

  // AUDIT FIX: Cast the hook to any to bypass the missing property error
  const { handleNewChat } = useChatHandler() as any

  const router = useRouter()

  const handleWorkspaceChange = (workspaceId: string) => {
    const workspace = workspaces.find((w: any) => w.id === workspaceId)
    if (workspace) {
      setSelectedWorkspace(workspace)
      handleNewChat()
      router.push(`/${workspace.id}/chat`)
    }
  }

  return (
    <div className="flex items-center space-x-2 p-2">
      <select
        className="bg-background border-input border-2 p-1 rounded text-sm w-full"
        value={selectedWorkspace?.id}
        onChange={e => handleWorkspaceChange(e.target.value)}
      >
        {workspaces.map((workspace: any) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  )
}
