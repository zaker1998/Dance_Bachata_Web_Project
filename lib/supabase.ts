import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

const env = getServerEnv();

export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
