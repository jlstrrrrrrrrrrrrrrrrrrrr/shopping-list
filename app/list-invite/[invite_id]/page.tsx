'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/auth-context';
import { useLists } from '@/hooks/use-lists';
import { use } from 'react';
import { PageContainer } from '@/components/page-container';

// Nanoid pattern for 10 character length
// Matches URL-friendly characters: a-z, A-Z, 0-9, - and _
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{10}$/;

interface InvitePageProps {
  params: Promise<{ invite_id: string }>;
}

const InvitePage = ({ params }: InvitePageProps) => {
  const resolvedParams = use(params);
  const { session } = useAuthContext();
  const { joinList, isLoading } = useLists();
  const inviteToken = resolvedParams.invite_id;
  const router = useRouter();
  const [status, setStatus] = useState('Validating invite...');

  useEffect(() => {
    if (!inviteToken) {
      setStatus('No invite token provided in the URL');
      return;
    }

    // Validate token format before making API call
    if (!TOKEN_PATTERN.test(inviteToken)) {
      setStatus('Invalid invite token format');
      return;
    }

    const acceptInvite = async () => {
      if (!session) {
        setStatus('Please log in to join this list');
        return;
      }

      try {
        await joinList(inviteToken);
        setStatus('Successfully joined the list!');
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.push('/lists');
        }, 1500);
      } catch (error: any) {
        setStatus(error.message || 'Failed to join the list.');
      }
    };

    acceptInvite();
  }, [inviteToken, session]);

  return (
    <PageContainer centered>
      <p className="text-lg">
        {isLoading ? 'Joining shopping list...' : status}
      </p>
    </PageContainer>
  );
};

export default InvitePage;
