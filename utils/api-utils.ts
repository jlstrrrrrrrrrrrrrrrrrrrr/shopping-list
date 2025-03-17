import { createClient } from '@/utils/supabase/client';

export const fetchWithAuth = async <T>(
  url: string,
  method: string = 'GET',
  body?: Record<string, any>
): Promise<T> => {
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  const accessToken = session?.access_token;

  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || 'Request failed');
  }

  return res.json();
};
