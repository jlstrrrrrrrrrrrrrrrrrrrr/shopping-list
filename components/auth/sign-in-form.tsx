'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage as FormErrorMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signInFormSchema } from '@/schemas/account-validation';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';
import Link from 'next/link';

interface SignInFormProps {
  formMessage?: any;
}

const SignInForm: React.FC<SignInFormProps> = ({ formMessage }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onSubmit'
  });

  const onSubmit = async (values: z.infer<typeof signInFormSchema>) => {
    try {
      setIsSubmitting(true);

      const response = await authService.signIn({
        email: values.email,
        password: values.password
      });

      if (response.success) {
        toast.success('Successfully signed in');
        router.push('/my-lists');
        router.refresh();
      } else {
        if (response.error === 'INVALID_LOGIN_CREDENTIALS') {
          toast.error('Invalid email or password');
        } else {
          toast.error(response.message);
        }
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
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    {...field}
                    autoComplete="email"
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="current-password"
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
            <Link href="/sign-up" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm;
