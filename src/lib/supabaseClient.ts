import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Falten les variables VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Configura-les a .env.local.',
  )
}

// Client sense generic estricte de Database: el tipatge de domini viu a
// src/types/database.ts i s'aplica als resultats de cada hook.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
