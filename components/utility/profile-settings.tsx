// @ts-nocheck
import { ChatbotUIContext } from "@/context/context"
import { FC, useContext, useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export const ProfileSettings: FC = () => {
  const { profile, setProfile } = useContext(ChatbotUIContext) as any

  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [username, setUsername] = useState(profile?.username || "")
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    // Update logic would go here
    setLoading(false)
  }

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-1">
        <div className="text-sm font-medium">Display Name</div>
        <Input
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <div className="text-sm font-medium">Username</div>
        <Input value={username} onChange={e => setUsername(e.target.value)} />
      </div>

      <Button onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  )
}
