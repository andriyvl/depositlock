import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey)