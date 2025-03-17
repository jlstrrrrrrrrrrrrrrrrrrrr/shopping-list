import SignInForm from '@/components/auth/sign-in-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function Login() {
  return (
    <AuthLayout
      title="Sign in"
      subtitle="Don't have an account?"
      linkText="Sign up"
      linkHref="/sign-up"
    >
      <SignInForm />
    </AuthLayout>
  );
}
