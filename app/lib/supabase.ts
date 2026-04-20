import { createClient } from '@supabase/supabase-js'

// Aquí le decimos a la app que busque las llaves en tu caja fuerte (.env.local)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Creamos la conexión oficial
export const supabase = createClient(supabaseUrl, supabaseAnonKey)