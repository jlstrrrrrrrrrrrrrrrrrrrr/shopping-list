'use client';

import React from 'react';
import ListItemCard from '@/components/shopping-list/list-item-card';
import NewListModal from '@/components/shopping-list/modals/new-list-modal';
import NewItemModal from '@/components/shopping-list/modals/new-item-modal';
import ListCarousel from '@/components/shopping-list/list-carousel';
import { useListItems } from '@/hooks/use-list-items';
import { useShoppingListContext } from '@/context/shopping-list-context';

interface MyListsProps {}

const MyLists: React.FC<MyListsProps> = ({}) => {
  const {
    selectedList,
    lists,
    items,
    isLoading: isUseListsLoading,
    error: useListsError
  } = useShoppingListContext();

  const {
    isLoading: isUseListItemsLoading,
    error: useListItemsError,
    deleteItem
  } = useListItems();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground">
          My Lists
          <span className="ml-2 text-primary">({lists.length})</span>
        </h1>

        <NewListModal />
      </div>

      {useListsError ? (
        <div className="bg-error rounded-md p-4 text-foreground">
          {useListsError}
        </div>
      ) : (
        <ListCarousel lists={lists} />
      )}

      <div className="mt-12 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              List Contents
            </h2>
            <span className="text-muted-foreground">{items?.length} items</span>
          </div>

          {selectedList && <NewItemModal listId={selectedList.id} />}
        </div>

        {useListItemsError ? (
          <div className="bg-error rounded-md p-4 text-foreground">
            {useListItemsError}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items?.map((item) => (
              <ListItemCard
                key={item.id}
                item={item}
                onDelete={() => deleteItem(item.id)}
                onUpdateStatus={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MyLists;
