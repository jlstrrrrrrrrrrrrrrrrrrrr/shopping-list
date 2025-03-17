import { List } from '@/types';
import { fetchWithAuth } from '@/utils/api-utils';

const BASE_API_URL = '/api/lists';

interface JoinListResponse {
  success: boolean;
  error?: string;
}

interface CreateInviteResponse {
  inviteToken: string;
}

// fetch user lists
export const getUserListsService = (): Promise<List[]> =>
  fetchWithAuth(`${BASE_API_URL}/get-all`, 'GET');

export const createListService = (name: string): Promise<List | null> =>
  fetchWithAuth(`${BASE_API_URL}/create`, 'POST', { name });

export const deleteListService = (listId: string): Promise<boolean> =>
  fetchWithAuth(`${BASE_API_URL}/delete`, 'DELETE', { listId });

export const joinListService = (
  inviteToken: string
): Promise<JoinListResponse> =>
  fetchWithAuth(`${BASE_API_URL}/join`, 'POST', { inviteToken });

export const refreshInviteTokenService = (
  listId: string,
  refresh?: boolean
): Promise<CreateInviteResponse> =>
  fetchWithAuth(`${BASE_API_URL}/refresh-invite-token`, 'POST', {
    listId,
    refresh
  });

export const leaveListService = (listId: string): Promise<boolean> =>
  fetchWithAuth(`${BASE_API_URL}/leave`, 'POST', { listId });
