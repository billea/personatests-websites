import { redirect } from 'next/navigation';

interface TestLayoutProps {
  children: React.ReactNode;
  params: { locale: string; testId: string };
}

export default function TestLayout({ children, params }: TestLayoutProps) {
  const { locale, testId } = params;
  
  // For protected tests, we'll handle this in the client component since
  // Firebase Auth is client-side only. The middleware will help with
  // the initial redirect, but final auth check happens client-side.
  
  return <>{children}</>;
}