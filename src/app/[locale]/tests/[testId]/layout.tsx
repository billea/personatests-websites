// Required for static export
export async function generateStaticParams() {
    // Generate static params for known test IDs
    return [
        { testId: 'mbti-classic' },
        { testId: 'big-five' },
        { testId: 'enneagram' },
        { testId: 'feedback-360' },
        { testId: 'couple-compatibility' },
        // New Knowledge and Skill Tests
        { testId: 'general-knowledge' },
        { testId: 'math-speed' },
        { testId: 'memory-power' },
        // New Just for Fun Tests  
        { testId: 'country-match' },
        { testId: 'mental-age' },
        { testId: 'spirit-animal' }
    ];
}

interface TestLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string; testId: string }>;
}

export default async function TestLayout({ children, params }: TestLayoutProps) {
    const { locale, testId } = await params;
    return <>{children}</>;
}