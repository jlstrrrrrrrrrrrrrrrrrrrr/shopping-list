import Link from 'next/link';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
  children: React.ReactNode;
}

export function AuthLayout({
  title,
  subtitle,
  linkText,
  linkHref,
  children
}: AuthLayoutProps) {
  return (
    <div className="mx-auto mt-16 flex w-64 flex-col">
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="mt-2 text-sm text-foreground">
        {subtitle}{' '}
        <Link className="font-medium text-foreground underline" href={linkHref}>
          {linkText}
        </Link>
      </p>
      {children}
    </div>
  );
}
