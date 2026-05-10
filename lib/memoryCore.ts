// lib/memoryCore.ts

// @ts-nocheck
import { supabase } from "@/lib/supabase/browser" // Standardizing to your existing client

export interface MemoryEntry {
  id?: string
  user_id: string
  timestamp: string
  emotional_tone: string
  symbolic_patterns: string[]
  living_equation_trigger?: string
  notes?: string
}

// Convert to a Class so the Engine can recognize the type
export class MemoryCore {
  async store(entry: any): Promise<void> {
    const { error } = await supabase.from("memory_entries").insert([entry])
    if (error) {
      console.error("Error storing memory entry:", error)
      throw error
    }
  }

  async getMemoriesByUser(user_id: string): Promise<MemoryEntry[]> {
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
  }
}
