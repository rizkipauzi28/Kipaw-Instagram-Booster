import React from 'react';

interface KipawLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
}

export const KipawLogo: React.FC<KipawLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
    xl: 38,
  };

  const px = iconSizes[size];

  return (
    <div
      className={`relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none ${
        sizeClasses[size]
      } ${
        withGlow ? 'shadow-xl shadow-pink-500/20' : ''
      } ${className}`}
      style={{
        background: 'linear-gradient(135deg, #FF1361 0%, #FFF800 50%, #9900FA 100%)',
        padding: '1.5px',
      }}
    >
      {/* Outer ambient glow */}
      {withGlow && (
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 opacity-60 blur-md group-hover:opacity-100 transition-opacity" />
      )}

      {/* Dark inner container with subtle glass shine */}
      <div className="w-full h-full rounded-[inherit] bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 flex items-center justify-center relative overflow-hidden backdrop-blur-md">
        {/* Specular gloss highlight */}
        <div className="absolute -top-6 -left-6 w-14 h-14 bg-white/20 rounded-full blur-sm pointer-events-none transform -rotate-45" />

        {/* Dynamic Vector Kipaw "K" + Boost Insignia */}
        <svg
          width={px}
          height={px}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_2px_8px_rgba(236,72,153,0.5)]"
        >
          <defs>
            {/* Main Gradient */}
            <linearGradient id="kipaw-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4B72" />
              <stop offset="50%" stopColor="#C026D3" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>

            {/* Accent Gold Gradient for Boost Spark */}
            <linearGradient id="kipaw-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>

            {/* Shine Linear */}
            <linearGradient id="kipaw-gloss-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Stylized 'K' Stem (Pillar with smooth chamfer) */}
          <path
            d="M9 7.5C9 6.67 9.67 6 10.5 6H13.5C14.33 6 15 6.67 15 7.5V32.5C15 33.33 14.33 34 13.5 34H10.5C9.67 34 9 33.33 9 32.5V7.5Z"
            fill="url(#kipaw-brand-grad)"
          />

          {/* Stylized 'K' Upper Branch - Ascending Fast Rocket/Chevron */}
          <path
            d="M17.5 20.8C16.8 21.3 16.8 22.3 17.5 22.8L27.2 30.5C28.2 31.3 29.7 30.5 29.7 29.2V25.2C29.7 24.5 29.3 23.9 28.7 23.4L21.5 17.8L28.6 11.8C29.3 11.2 29.7 10.4 29.7 9.6V6.8C29.7 5.4 28.1 4.7 27.1 5.6L17.5 14.2C16.8 14.8 16.8 15.9 17.5 16.5L20.2 18.9L17.5 20.8Z"
            fill="url(#kipaw-brand-grad)"
          />

          {/* Boost Flame / Lightning Spark overlay inside K */}
          <path
            d="M20 7L24.5 13H19.5L23.5 20.5L16.5 14.5H21.5L20 7Z"
            fill="url(#kipaw-gold-grad)"
            className="animate-pulse"
          />

          {/* Organic Sparkle Star in top right corner */}
          <path
            d="M32 5C32 7.2 30.2 9 28 9C30.2 9 32 10.8 32 13C32 10.8 33.8 9 36 9C33.8 9 32 7.2 32 5Z"
            fill="url(#kipaw-gold-grad)"
          />

          {/* Dynamic gloss highlight stroke */}
          <path
            d="M10 8H14M18.5 14.5L26 8"
            stroke="url(#kipaw-gloss-grad)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};
