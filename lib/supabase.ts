// lib/services/supabase-client.ts
import { createClient } from "@supabase/supabase-js";

// Create the client outside component lifecycle, preferably in a singleton pattern
let supabaseClient: ReturnType<typeof createClient> | null = null;

// Interface for font style
interface FontStyle {
  style_id: number;
  "Font Style": string;
  [key: string]: any; // For all character columns (A-Z, a-z, 0-9)
}

// Get (or create) Supabase client
function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;
  
  // Create the client only when needed
  supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pwxejnelixbqnuwovqvp.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );
  
  return supabaseClient;
}

// Fetch font styles
export async function fetchFontStyles(): Promise<FontStyle[]> {
  const client = getSupabaseClient();
  
  try {
    const { data, error } = await client
      .from('font_styles')
      .select('*');
      
    if (error) throw error;
    return data as FontStyle[];
  } catch (error) {
    console.error('Error fetching styles:', error);
    return [];
  }
}

// Clean up function that can be called when your app unmounts
export function cleanupSupabaseClient() {
  supabaseClient = null;
}