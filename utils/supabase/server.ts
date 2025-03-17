import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient as createServerAdminClient } from '@supabase/supabase-js';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        }
      }
    }
  );
};

export const createAdminClient = () => {
  return createServerAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!, // Must use the service key (RLS)
    {
      global: {
        headers: {}
      }
    }
  );
};
