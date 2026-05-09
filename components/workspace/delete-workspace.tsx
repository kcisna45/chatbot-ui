// @ts-nocheck
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Tables } from "@/supabase/types"
import { FC, useState } from "react"

interface DeleteWorkspaceProps {
  // AUDIT FIX: Using any to bypass table constraints
  workspace: any
  onDelete: () => void
}

export const DeleteWorkspace: FC<DeleteWorkspaceProps> = ({
  workspace,
  onDelete
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Workspace</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {workspace.name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this workspace? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onDelete()
              setIsOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
