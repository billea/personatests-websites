import { TranslationProvider } from "@/components/providers/translation-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

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
