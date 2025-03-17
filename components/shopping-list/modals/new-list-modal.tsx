'use client';

import React, { useState } from 'react';
import { useShoppingListContext } from '@/context/shopping-list-context';
import { useLists } from '@/hooks/use-lists';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Clipboard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

const createListSchema = z.object({
  listName: z.string().min(1, 'List name is required')
});

const joinListSchema = z.object({
  inviteToken: z
    .string()
    .min(1, 'Invite token is required')
    .transform((val) => {
      // If it's a full URL, extract just the token
      if (val.includes('/list-invite/')) {
        return val.split('/list-invite/')[1].split('?')[0];
      }
      return val;
    })
    .refine((val) => /^[A-Za-z0-9_-]{10}$/.test(val), {
      message: 'Invalid invite token format'
    })
});

const NewListModal = () => {
  const router = useRouter();
  const { isLoading } = useShoppingListContext();
  const { createList, joinList } = useLists();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('create');

  const createForm = useForm({
    resolver: zodResolver(createListSchema),
    defaultValues: { listName: '' }
  });

  const joinForm = useForm({
    resolver: zodResolver(joinListSchema),
    defaultValues: { inviteToken: '' }
  });

  const onCreateSubmit = async (values: { listName: string }) => {
    try {
      await createList(values.listName);
      createForm.reset();
      setIsModalOpen(false);
    } catch (err: any) {
      createForm.setError('listName', { message: err.message });
    }
  };

  const handlePaste = async (field: { onChange: (value: string) => void }) => {
    try {
      const text = await navigator.clipboard.readText();
      field.onChange(text); // Just paste whatever was copied
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const onJoinSubmit = async (values: { inviteToken: string }) => {
    try {
      // Extract token if full URL was pasted
      const token = values.inviteToken.includes('/list-invite/')
        ? values.inviteToken.split('/list-invite/')[1].split('?')[0]
        : values.inviteToken;

      await joinList(token);
      joinForm.reset();
      setIsModalOpen(false);
      router.push('/my-lists');
    } catch (err: any) {
      joinForm.setError('inviteToken', { message: err.message });
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New List
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Shopping List</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="create">Create List</TabsTrigger>
            <TabsTrigger value="join">Join List</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-0">
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(onCreateSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={createForm.control}
                  name="listName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>List Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Groceries" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating...' : 'Create List'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="join" className="mt-0">
            <Form {...joinForm}>
              <form
                onSubmit={joinForm.handleSubmit(onJoinSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={joinForm.control}
                  name="inviteToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invite Token</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Paste the invite token or link here"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-accent"
                            onClick={() => handlePaste(field)}
                          >
                            <Clipboard className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Joining...' : 'Join List'}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default NewListModal;
