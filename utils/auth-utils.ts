'use server';

import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export async function getAuthenticatedUser(req: NextRequest) {
  const supabase = await createClient();

  // Extract the Bearer token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { user: null, error: 'Missing or invalid token' };
  }

  const token = authHeader.split('Bearer ')[1];

  // Validate token & get user
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return { user: null, error: 'Unauthorized' };
  }

  return { user, error: null };
}

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect('/sign-in');
};
