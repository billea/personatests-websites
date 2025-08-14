import { TranslationProvider } from "@/components/providers/translation-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

// Generate static params for all supported locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'ko' },
    { locale: 'ja' },
    { locale: 'zh' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'it' },
    { locale: 'pt' }
  ];
}

export default function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <TranslationProvider>
        {children}
      </TranslationProvider>
    </AuthProvider>
  );
}
