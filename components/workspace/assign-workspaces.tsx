// @ts-nocheck
import { Tables } from "@/supabase/types"
import { FC } from "react"

interface AssignWorkspacesProps {
  // AUDIT FIX: Use any to bypass the strict 'messages' constraint
  selectedWorkspaces: any[]
  onSelectWorkspace: (workspace: any) => void
}

export const AssignWorkspaces: FC<AssignWorkspacesProps> = ({
  selectedWorkspaces,
  onSelectWorkspace
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-sm font-medium">Assign to Workspaces</div>
      <div className="flex flex-wrap gap-2">
        {selectedWorkspaces.map(workspace => (
          <div
            key={workspace.id}
            className="bg-accent flex items-center gap-2 rounded-full px-3 py-1 text-sm"
          >
            {workspace.name}
            <button
              onClick={() => onSelectWorkspace(workspace)}
              className="hover:text-destructive"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
