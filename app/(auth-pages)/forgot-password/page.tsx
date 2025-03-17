import ForgotPasswordForm from '@/components/auth/forgot-password-form';

export default function ForgotPassword() {
  return (
    <div className="mx-auto flex w-full min-w-64 max-w-64 flex-col gap-2 text-foreground">
      <h1 className="text-2xl font-medium">Reset Password</h1>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
