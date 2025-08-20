// Required for static export - we can't know invitationIds at build time
export async function generateStaticParams() {
    // Return empty array since invitation IDs are dynamic
    return [];
}

interface FeedbackLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string; invitationId: string }>;
}

export default async function FeedbackLayout({ children, params }: FeedbackLayoutProps) {
    const { locale, invitationId } = await params;
    return <>{children}</>;
}