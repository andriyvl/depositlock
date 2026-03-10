import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL')
}

if (!supabaseServiceKey) {
  throw new Error(
    'Missing environment variable: SUPABASE_SERVICE_KEY'
  )
}

if (supabaseServiceKey.startsWith('sb_publishable_')) {
  throw new Error('Invalid Supabase server key: use a server-side service role key, not a publishable key')
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export function getSupabaseAdminClient(): SupabaseClient {
  return supabaseAdmin
}
