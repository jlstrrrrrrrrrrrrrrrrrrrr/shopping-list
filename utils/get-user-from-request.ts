import { createClient } from '@/utils/supabase/server';

export async function getUserFromRequest(req: Request) {
  const supabase = await createClient();
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}
