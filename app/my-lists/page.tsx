import { PageContainer } from '@/components/page-container';
import MyLists from '@/components/shopping-list/my-lists';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function MyListsPage() {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <PageContainer>
      <MyLists />
    </PageContainer>
  );
}
