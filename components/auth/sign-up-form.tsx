'use client';

import React, { useState, useEffect } from 'react';
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
import { CheckCircle2 } from 'lucide-react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  signUpFormSchema,
  type SignUpRequest
} from '@/schemas/account-validation';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';

const SignUpForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');
  const [canResend, setCanResend] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onSubmit'
  });

  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (resendTimer === 0) {
      setCanResend(true);
      setResendTimer(60);
    }
  }, [canResend, resendTimer]);

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    try {
      setIsSubmitting(true);
      setUserEmail(values.email);

      const response = await authService.signUp({
        email: values.email,
        password: values.password
      });

      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message);
      } else {
        if (response.error === 'EMAIL_EXISTS') {
          form.setError('email', {
            type: 'manual',
            message: 'This email is already registered'
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
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="h-12 w-12 text-green-500" />
          <h2 className="text-xl font-semibold">Check your email</h2>
        </div>

        <div className="space-y-4 text-muted-foreground">
          <p>
            We've sent a verification link to:
            <br />
            <span className="font-medium text-foreground">{userEmail}</span>
          </p>
          <p className="text-sm">
            Click the link in the email to verify your account and start using
            CartCrew.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">
            Didn't receive the email?
          </p>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              disabled={!canResend}
              onClick={() => {
                setCanResend(false);
              }}
            >
              {canResend
                ? 'Resend verification email'
                : `Try again in ${resendTimer}s`}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsSuccess(false)}
            >
              Use a different email
            </Button>
          </div>
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
                    autoComplete="new-password"
                    onPaste={(e) => e.preventDefault()}
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
                <FormErrorMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    {...field}
                    autoComplete="new-password"
                    onPaste={(e) => e.preventDefault()}
                    className={fieldState.error ? 'border-red-500' : ''}
                  />
                </FormControl>
                <FormErrorMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </Button>

          {/* <FormMessage message={formMessage} /> */}
        </form>
      </Form>
    </div>
  );
};

export default SignUpForm;
