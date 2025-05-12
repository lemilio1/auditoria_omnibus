"use client"

import { createClientComponentClient } from "@supabase/supabase-js"

export function getSupabaseClient() {
  return createClientComponentClient()
}
