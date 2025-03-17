import MyAccountMenu from '@/components/my-account/my-account-menu';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MyAccountPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-12">
      <MyAccountMenu />
    </div>
  );
}
