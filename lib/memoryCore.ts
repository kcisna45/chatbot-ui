// @ts-nocheck
export class MemoryCore {
  async store(entry: any): Promise<void> {
    try {
      const { error } = await supabase.from("memory_entries").insert([entry])
      if (error) {
        console.error("Error storing memory entry:", error)
        throw error
      }
    } catch (err) {
      console.error("Failed to store memory entry:", err)
    }
  }

  async getMemoriesByUser(user_id: string): Promise<MemoryEntry[]> {
    try {
      const { data, error } = await supabase
        .from("memory_entries")
        .select("*")
        .eq("user_id", user_id)
        .order("timestamp", { ascending: false })

      if (error) {
        console.error("Error fetching memory entries:", error)
        throw error
      }

      return data || []
    } catch (err) {
      console.error("Failed to fetch memory entries:", err)
      return []
    }
  }
}
