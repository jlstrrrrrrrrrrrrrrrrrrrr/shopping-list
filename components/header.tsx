import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { ShoppingCart } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { signOutAction } from '@/utils/auth-utils';

const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 z-[9999] w-full bg-background/30 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={'/'} className="flex items-center">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-foreground">
            CartCrew
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          {user ? (
            <Button
              asChild
              variant="outline"
              className="cursor-pointer text-foreground hover:bg-muted"
              onClick={signOutAction}
            >
              <span>Log out</span>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-foreground hover:bg-muted"
              >
                <Link href="/sign-in">Log in</Link>
              </Button>

              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
