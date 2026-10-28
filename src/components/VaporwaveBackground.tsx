import React from 'react';

const VAPORWAVE_BG = '/src/assets/images/vaporwave_sunset_bg_1793149164785.jpg';

interface VaporwaveBackgroundProps {
  crtEnabled: boolean;
}

export const VaporwaveBackground: React.FC<VaporwaveBackgroundProps> = ({ crtEnabled }) => {
  return (
    <>
      {/* Background Graphic Asset with Fallback Scrim */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src={VAPORWAVE_BG}
          alt="Vaporwave horizon backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 sm:opacity-40 filter saturate-150 contrast-110"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 vaporwave-grid opacity-25" />
        {/* Dark radial vignette to keep visual focus on gameplay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#090514]/75 to-[#090514]" />
      </div>

      {/* Optional CRT Scanlines Effect */}
      {crtEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 crt-scanlines opacity-40 mix-blend-overlay" />
      )}
    </>
  );
};
