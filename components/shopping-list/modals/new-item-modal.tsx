import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useListItems } from '@/hooks/use-list-items';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';

interface NewItemModalProps {
  listId: string;
}

const NewItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional()
});

const NewItemModal: React.FC<NewItemModalProps> = ({ listId }) => {
  const { addItemToList, isLoading, error } = useListItems();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(NewItemSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await addItemToList(data.name, data.description);
      form.reset();
      setIsModalOpen(false);
    } catch (err: any) {
      alert('Error adding item: ' + err.message);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Add New Item
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Add New Item</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Organic Milk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Additional details" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Personal reminders" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="assign">Assign to</Label>
                <Button variant="link" size="sm" className="text-primary">
                  Assign to me
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Input id="assign" placeholder="Select collaborator" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Adding...' : 'Add Item'}
              </Button>
            </div>
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewItemModal;
