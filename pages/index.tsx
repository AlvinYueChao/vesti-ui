import React, { useState, useEffect } from 'react';
import { StyleTest } from './onboarding/StyleTest';
import HomePage from './home/HomePage';

const IndexPage: React.FC = () => {
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        // Check if user has completed onboarding
        const onboardingCompleted = localStorage.getItem('onboarding_completed');
        setHasCompletedOnboarding(onboardingCompleted === 'true');
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem('onboarding_completed', 'true');
        setHasCompletedOnboarding(true);
    };

    // Show loading or nothing while checking onboarding status
    if (hasCompletedOnboarding === null) {
        return <div>Loading...</div>;
    }

    // Show onboarding if not completed, otherwise show home page
    if (!hasCompletedOnboarding) {
        return <StyleTest onComplete={handleOnboardingComplete} />;
    }

    return <HomePage />;
};

export default IndexPage;
