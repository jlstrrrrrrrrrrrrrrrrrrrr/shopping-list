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
import Link from 'next/link';

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address')
});

const ForgotPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onSubmit'
  });

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsSubmitting(true);
      setUserEmail(values.email);

      const response = await authService.forgotPassword(values.email);

      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message);
      } else {
        if (response.error === 'EMAIL_NOT_FOUND') {
          form.setError('email', {
            type: 'manual',
            message: 'No account found with this email'
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

  if (isSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="space-y-4 text-muted-foreground">
          <p>
            We've sent a password reset link to:
            <br />
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
          <p className="text-sm">
            Click the link in the email to reset your password.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Button
            variant="ghost"
            className="w-full"
            onClick={() => setIsSuccess(false)}
          >
            Try a different email
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          Make sure to check your spam folder if you don't see the email in your
          inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                    autoComplete="email"
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Reset Password'}
          </Button>

          <div className="text-center text-sm">
            Remember your password?{' '}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
