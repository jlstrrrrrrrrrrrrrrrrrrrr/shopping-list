import { ListItem } from '@/types';
import { fetchWithAuth } from '@/utils/api-utils';

const BASE_API_URL = '/api/list-items';

export const getListItemsService = (listId: string): Promise<ListItem[]> => {
  return fetchWithAuth<{ items: ListItem[] }>(
    `${BASE_API_URL}/get-all?listId=${listId}`,
    'GET'
  ).then((data) => data.items || []);
};

export const addItemToListService = async (
  listId: string,
  name: string,
  description?: string
): Promise<boolean> => {
  await fetchWithAuth(`${BASE_API_URL}/add`, 'POST', {
    listId,
    name,
    description
  });

  return true; // If no error is thrown, assume success
};

export const deleteItemFromList = async (itemId: string): Promise<boolean> => {
  await fetchWithAuth(`${BASE_API_URL}/delete`, 'DELETE', { itemId });

  return true; // If no error is thrown, assume success
};

export const updateItemStatus = async (
  itemId: string,
  status: string
): Promise<boolean> => {
  const res = await fetch(`${BASE_API_URL}/update-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ itemId, status })
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Error updating status');
  }

  return true;
};
