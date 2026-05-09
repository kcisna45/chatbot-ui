// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export const WorkspaceSettings: FC = () => {
  const { selectedWorkspace, setSelectedWorkspace } = useContext(
    ChatbotUIContext
  ) as any

  const [name, setName] = useState(selectedWorkspace?.name || "")
  const [description, setDescription] = useState(
    selectedWorkspace?.description || ""
  )
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Update logic here
    setLoading(false)
  }

  if (!selectedWorkspace) return null

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label>Workspace Name</Label>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </div>

      <div className="space-y-1">
        <Label>Description</Label>
        <Input
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
