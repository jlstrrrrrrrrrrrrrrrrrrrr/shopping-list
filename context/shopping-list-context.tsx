'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import { List, ListItem } from '@/types';
import { getUserListsService } from '@/services/list-service';
import { useAuthContext } from '@/context/auth-context';
import { getListItemsService } from '@/services/list-item-service';
import { createClient } from '@/utils/supabase/client';

type ShoppingListContextType = {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  fetchLists: () => Promise<void>;
  selectedList: List | null;
  setSelectedList: React.Dispatch<React.SetStateAction<List | null>>;
  fetchItems: () => Promise<void>;
  items: ListItem[];
  isLoading: boolean;
  error: string | null;
};

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(
  undefined
);

interface ShoppingListProviderProps {
  children: ReactNode;
}

export function ShoppingListProvider({ children }: ShoppingListProviderProps) {
  const { session } = useAuthContext();
  const accessToken = session?.access_token;

  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<List | null>(null);
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user lists
  const fetchLists = async () => {
    if (!accessToken) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getUserListsService();
      setLists(data);

      if (data.length) {
        setSelectedList(data[0]);
      }
    } catch (err: any) {
      setError('Error fetching lists: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch items for the list
  const fetchItems = async () => {
    if (!selectedList) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getListItemsService(selectedList.id);
      setItems(data);
    } catch (err: any) {
      setError('Error fetching items: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch lists on mount
  useEffect(() => {
    if (accessToken) {
      fetchLists();
    }
  }, [accessToken]);

  useEffect(() => {
    const supabase = createClient();

    if (!selectedList) {
      return;
    }

    const subscription = supabase
      .channel('list_items')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'list_items' },
        (payload: any) => {
          console.log('Change received!', payload);

          setItems((prevItems) => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prevItems, payload.new]; // Add new item
              case 'UPDATE':
                return prevItems.map((item) =>
                  item.id === payload.new.id ? payload.new : item
                ); // Update item
              case 'DELETE':
                return prevItems.filter((item) => item.id !== payload.old.id); // Remove deleted item
              default:
                return prevItems;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Cleanup on unmount
    };
  }, [selectedList]);

  useEffect(() => {
    fetchItems();
  }, [selectedList]);

  return (
    <ShoppingListContext.Provider
      value={{
        lists,
        setLists,
        fetchLists,
        selectedList,
        setSelectedList,
        fetchItems,
        items,
        isLoading,
        error
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingListContext() {
  const context = useContext(ShoppingListContext);

  if (!context)
    throw new Error(
      'useShoppingListContext must be used within a ShoppingListProvider'
    );

  return context;
}
