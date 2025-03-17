import SignUpForm from '@/components/auth/sign-up-form';
import { AuthLayout } from '@/components/auth/auth-layout';

export default function SignUp() {
  return (
    <AuthLayout
      title="Sign up"
      subtitle="Already have an account?"
      linkText="Sign in"
      linkHref="/sign-in"
    >
      <SignUpForm />
    </AuthLayout>
  );
}
