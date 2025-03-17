'use client';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { List } from '@/types';
import { useShoppingListContext } from '@/context/shopping-list-context';
import ListCard from '@/components/shopping-list/list-card';

interface ListCarouselProps {
  lists: List[];
  itemCounts?: Record<string, number>;
}

const ListCarousel: React.FC<ListCarouselProps> = ({
  lists,
  itemCounts = {}
}) => {
  const { setSelectedList } = useShoppingListContext();

  return (
    <Carousel opts={{ align: 'start' }} className="group relative w-full">
      <CarouselContent className="-ml-2 px-4 md:px-0">
        {lists?.map((list) => (
          <CarouselItem
            key={list.id}
            className="basis-3/4 pl-2 md:basis-1/2 lg:basis-1/3"
            onClick={() => setSelectedList(list)}
          >
            <div className="h-full p-1">
              <ListCard list={list} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      <div className="opacity-0 transition-opacity group-hover:opacity-100">
        <CarouselPrevious className="left-2 bg-card text-foreground hover:bg-muted" />
        <CarouselNext className="right-2 bg-card text-foreground hover:bg-muted" />
      </div>
    </Carousel>
  );
};

export default ListCarousel;
