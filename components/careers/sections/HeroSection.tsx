'use client';

import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  data: {
    heading?: string;
    subheading?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    gradientStart?: string;
    gradientEnd?: string;
  };
  logo?: string | null;
  companyName: string;
}

export default function HeroSection({ data, logo, companyName }: HeroSectionProps) {
  const {
    heading = 'Join Our Team',
    subheading = 'future',
    description = 'Build something amazing with us',
    buttonText = 'View jobs',
    buttonLink = '#jobs',
    gradientStart = '#1a4d4d',
    gradientEnd = '#4a5283',
  } = data;

  const handleScroll = () => {
    if (buttonLink.startsWith('#')) {
      const element = document.querySelector(buttonLink);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative min-h-[500px] flex flex-col items-center justify-center text-white px-4 py-20"
      style={{
        background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
      }}
    >
      <div className="max-w-3xl mx-auto text-center space-y-6">
        {logo && (
          <img
            src={logo}
            alt={companyName}
            className="h-16 w-16 mx-auto mb-8 rounded-lg object-cover"
          />
        )}

     <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
  {data.heading || `Careers at ${companyName}`}
</h1>
{data.subheading && (
  <p className="text-xl md:text-2xl mb-6 font-medium opacity-90">
    {data.subheading}
  </p>
)}

        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        <Button
          size="lg"
          onClick={handleScroll}
          className="mt-6 bg-white/20 hover:bg-white/30 text-white border border-white/30"
        >
          {buttonText}
        </Button>
      </div>
    </section>
  );
}