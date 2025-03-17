import ResetPasswordForm from '@/components/auth/reset-password-form';

export default function ResetPassword() {
  return (
    <div className="mx-auto flex w-full min-w-64 max-w-64 flex-col gap-2 text-foreground">
      <h1 className="text-2xl font-medium">Reset Password</h1>
      <div className="mt-8">
        <ResetPasswordForm />
      </div>
    </div>
  );
}
