'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
  });

const ResetPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onSubmit'
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await authService.resetPassword(
        values.password,
        values.confirmPassword
      );

      if (response.success) {
        toast.success(response.message);
        router.push('/sign-in');
      } else {
        if (response.error === 'PASSWORD_MISMATCH') {
          form.setError('confirmPassword', {
            type: 'manual',
            message: "Passwords don't match"
          });
        }
        toast.error(response.message);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="new-password"
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                {field.value && (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1 flex-1 rounded ${
                          field.value.length >= 8 &&
                          /[A-Z]/.test(field.value) &&
                          /[a-z]/.test(field.value) &&
                          /[0-9]/.test(field.value)
                            ? 'bg-green-500'
                            : field.value.length >= 6
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      />
                      <span className="text-foreground/60">
                        {field.value.length >= 8 &&
                        /[A-Z]/.test(field.value) &&
                        /[a-z]/.test(field.value) &&
                        /[0-9]/.test(field.value)
                          ? 'Strong'
                          : field.value.length >= 6
                            ? 'Medium'
                            : 'Weak'}
                      </span>
                    </div>
                    <ul className="space-y-1 text-muted-foreground">
                      <li
                        className={
                          field.value.length >= 8 ? 'text-green-500' : ''
                        }
                      >
                        {field.value.length >= 8 ? '✓' : '•'} At least 8
                        characters
                      </li>
                      <li
                        className={
                          /[A-Z]/.test(field.value) ? 'text-green-500' : ''
                        }
                      >
                        {/[A-Z]/.test(field.value) ? '✓' : '•'} One uppercase
                        letter
                      </li>
                      <li
                        className={
                          /[a-z]/.test(field.value) ? 'text-green-500' : ''
                        }
                      >
                        {/[a-z]/.test(field.value) ? '✓' : '•'} One lowercase
                        letter
                      </li>
                      <li
                        className={
                          /[0-9]/.test(field.value) ? 'text-green-500' : ''
                        }
                      >
                        {/[0-9]/.test(field.value) ? '✓' : '•'} One number
                      </li>
                    </ul>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="new-password"
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
