// @ts-nocheck
import { createClient } from "@supabase/supabase-js"

// 1. Initialize the connection (Ensure these match your .env keys)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. Define the Interface so the code knows what a 'MemoryEntry' is
export interface MemoryEntry {
  id?: string
  user_id: string
  emotional_tone: string
  symbolic_patterns: string[]
  living_equation_trigger?: string
  resonance_level?: number
  timestamp?: string
}

// 3. The Class Wrapper
export class MemoryCore {
  async store(entry: any): Promise<void> {
    console.log("ATTEMPTING DATABASE INSERT:", entry)
    try {
      const { data, error } = await supabase
        .from("memory_entries")
        .insert([entry])
        .select()

      if (error) {
        console.error("CRITICAL DATABASE ERROR:", error.message)
        throw error
      }

      console.log("SUCCESSFUL INSERT:", data)
    } catch (err) {
      console.error("TOTAL SYSTEM FAILURE IN MEMORYCORE:", err)
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
