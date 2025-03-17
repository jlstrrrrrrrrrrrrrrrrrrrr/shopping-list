import { PageContainer } from '@/components/page-container';

export default async function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  return <PageContainer>{children}</PageContainer>;
}
