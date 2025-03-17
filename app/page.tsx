import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className="bg-gradient-to-br from-background to-primary/10">
      <div>
        <section className="relative flex h-screen items-center">
          <div className="absolute inset-0 z-10 bg-foreground/50"></div>
          <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="mb-6 text-4xl font-extrabold text-card sm:text-5xl md:text-6xl">
              Shop Smarter,
              <br />
              <span className="text-primary">Together</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
              No more forgotten items. No more phone calls in the grocery store.
              CartCrew makes collaborative shopping a breeze. No more spending
              on unnecessary and unhealthy stuff you fall in love with in the
              groceries. Stay organized and stick to the plan.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-primary px-8 py-4 text-lg text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/signup">
                Get Started - It's Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="bg-card py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              Why Choose CartCrew?
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center shadow-lg">
                <div className="mb-4 inline-block rounded-full bg-primary p-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Share with Anyone
                </h3>
                <p className="text-muted-foreground">
                  Create lists for your partner, family, or weekend BBQ with
                  friends.
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center shadow-lg">
                <div className="mb-4 inline-block rounded-full bg-secondary p-4">
                  <Zap className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Real-time Updates
                </h3>
                <p className="text-muted-foreground">
                  See changes instantly as your team updates the list on the go.
                </p>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-6 text-center shadow-lg">
                <div className="mb-4 inline-block rounded-full bg-primary p-4">
                  <ShoppingCart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">
                  Never Forget an Item
                </h3>
                <p className="text-muted-foreground">
                  Smart suggestions based on your shopping history keep you
                  covered.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20">
          {/* <Image
            src="/happy-shoppers.jpg"
            alt="Happy shoppers"
            layout="fill"
            objectFit="cover"
            quality={100}
            className="absolute inset-0 z-0"
          /> */}
          <div className="absolute inset-0 z-10 bg-primary/80"></div>
          <div className="relative z-20 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-6 text-3xl font-bold text-card">
              Experience Stress-Free Shopping
            </h2>
            <div className="mb-10 grid grid-cols-1 gap-6 text-left text-card md:grid-cols-2 lg:grid-cols-3">
              {/* ... checklist items ... */}
            </div>
            <Button
              asChild
              size="lg"
              className="bg-card px-8 py-4 text-lg text-primary hover:bg-muted"
            >
              <Link href="/signup">
                Start Shopping Smarter
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
