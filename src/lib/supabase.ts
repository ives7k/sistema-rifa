// src/lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lazy initialization to avoid errors during build time
let _supabase: SupabaseClient | null = null;
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return { supabaseUrl, supabaseAnonKey, supabaseServiceKey };
}

// Cliente para uso no lado do cliente (client-side/browser)
// Usa a chave anônima pública
export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabase) {
      const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Variáveis de ambiente do Supabase não definidas (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).');
      }
      _supabase = createClient(supabaseUrl, supabaseAnonKey);
    }
    return (_supabase as unknown as Record<string, unknown>)[prop as string];
  }
});

// Cliente para uso no lado do servidor (server-side/API routes)
// Usa a chave de serviço para ter privilégios de administrador
export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    if (!_supabaseAdmin) {
      const { supabaseUrl, supabaseServiceKey } = getSupabaseConfig();
      if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Variáveis de ambiente do Supabase não definidas (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).');
      }
      _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return (_supabaseAdmin as unknown as Record<string, unknown>)[prop as string];
  }
});
