import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import MobileMenu from '@/components/menu/mobile-menu';
import Header from '@/components/header';
import { ShoppingListProvider } from '@/context/shopping-list-context';
import { Toaster } from 'sonner';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase'
};

const geistSans = Geist({
  display: 'swap',
  subsets: ['latin']
});

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ShoppingListProvider>
              <Toaster />
              <Header />
              <main className="flex min-h-screen w-full flex-col items-center pb-[68px] pt-[64px]">
                <div className="flex w-full flex-1 flex-col items-center">
                  <div className="flex h-full w-full max-w-5xl flex-1 flex-col gap-20">
                    {children}
                  </div>
                </div>
              </main>
              <MobileMenu />
            </ShoppingListProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
