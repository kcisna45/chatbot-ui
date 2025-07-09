import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getProfileByUserId = async (userId: string) => {
console.log("🪵 getProfileByUserId called with:", userId);

const { data: profile, error } = await supabase
.from("profiles")
.select("*")
.eq("user_id", userId)
.single()

if (!profile) {
throw new Error(error?.message || `No profile found for user_id: ${userId}`)
}

return profile
}

export const getProfilesByUserId = async (userId: string) => {
console.log("🪵 getProfilesByUserId called with:", userId);

const { data: profiles, error } = await supabase
.from("profiles")
.select("*")
.eq("user_id", userId)

if (!profiles) {
throw new Error(error?.message || `No profiles found for user_id: ${userId}`)
}

return profiles
}

export const createProfile = async (profile: TablesInsert<"profiles">) => {
console.log("🪵 createProfile called with:", profile);

const { data: createdProfile, error } = await supabase
.from("profiles")
.insert([profile])
.select("*")
.single()

if (error) {
throw new Error(error.message)
}

return createdProfile
}

export const updateProfile = async (
profileId: string,
profile: TablesUpdate<"profiles">
) => {
console.log("🪵 updateProfile called with:", profileId, profile);

const { data: updatedProfile, error } = await supabase
.from("profiles")
.update(profile)
.eq("id", profileId)
.select("*")
.single()

if (error) {
throw new Error(error.message)
}

return updatedProfile
}

export const deleteProfile = async (profileId: string) => {
console.log("🪵 deleteProfile called with:", profileId);

const { error } = await supabase
.from("profiles")
.delete()
.eq("id", profileId)

if (error) {
throw new Error(error.message)
}

return true
}
