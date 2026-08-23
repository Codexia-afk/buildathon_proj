import React from 'react';
import { HeroSection } from './HeroSection';
import { FeatureGrid } from './FeatureGrid';
import { MissionBanner } from './MissionBanner';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-12">
      <HeroSection />
      <FeatureGrid />
      <MissionBanner />
    </div>
  );
};
