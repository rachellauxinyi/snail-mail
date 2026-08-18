import { useState, useEffect } from 'react';

const splashStyles = `
@keyframes snailCrawl {
  from { transform: translateX(-120px); }
  to   { transform: translateX(calc(100vw + 120px)); }
}
@keyframes snailDrag {
  0%         { transform: translateY(0px) rotate(0deg); }
  15%        { transform: translateY(2px) rotate(1.5deg); }
  35%        { transform: translateY(-2px) rotate(-0.5deg); }
  55%        { transform: translateY(3px) rotate(1deg); }
  75%        { transform: translateY(-1px) rotate(-0.8deg); }
  100%       { transform: translateY(0px) rotate(0deg); }
}
@keyframes shellSway {
  0%,100% { transform: rotate(0deg) translateY(0px); }
  40%     { transform: rotate(3deg) translateY(-1px); }
  70%     { transform: rotate(-2deg) translateY(1px); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes titleAppear {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes bentoIn {
  from { opacity: 0; transform: scale(0.88) translateY(18px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}
`;

function SnailSVG() {
  return (
    <svg width="96" height="64" viewBox="0 0 96 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shell */}
      <circle cx="58" cy="28" r="20" fill="#F0E8D8" stroke="#A89478" strokeWidth="1.6"/>
      {/* Shell spiral rings */}
      <ellipse cx="58" cy="28" rx="13" ry="13" stroke="#B8A088" strokeWidth="1" fill="none"/>
      <ellipse cx="58" cy="28" rx="7" ry="7" stroke="#B8A088" strokeWidth="0.9" fill="none"/>
      <ellipse cx="58" cy="28" rx="3" ry="3" stroke="#B8A088" strokeWidth="0.8" fill="#D4C4A8"/>
      {/* Shell spiral curve */}
      <path d="M58 15 Q72 16 72 28 Q72 42 58 42 Q44 42 44 28 Q44 20 52 17" stroke="#A89478" strokeWidth="0.7" fill="none" opacity="0.5"/>
      {/* Body / foot */}
      <path d="M6 44 Q4 48 8 52 Q22 58 55 56 Q75 54 82 48 Q86 43 80 40 Q72 38 58 40 Q38 42 18 42 Q10 42 6 44Z" fill="#E8D8C0" stroke="#A89478" strokeWidth="1.4" strokeLinejoin="round"/>
      {/* Head bulge */}
      <ellipse cx="18" cy="40" rx="10" ry="9" fill="#EDE0CC" stroke="#A89478" strokeWidth="1.2"/>
      {/* Left antenna */}
      <path d="M14 32 Q11 22 10 14" stroke="#8B7355" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      {/* Right antenna */}
      <path d="M20 31 Q18 21 18 12" stroke="#8B7355" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
      {/* Antenna tips */}
      <circle cx="10" cy="13" r="2.5" fill="#8B7355"/>
      <circle cx="18" cy="11" r="2.5" fill="#8B7355"/>
      {/* Eye shine */}
      <circle cx="11" cy="12" r="0.8" fill="#FAF6F0"/>
      <circle cx="19" cy="10" r="0.8" fill="#FAF6F0"/>
      {/* Smile */}
      <path d="M15 42 Q18 44 21 42" stroke="#8B7355" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
    </svg>
  );
}

interface SplashPageProps {
  onEnter: () => void;
}

export function SplashPage({ onEnter }: SplashPageProps) {
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 420);
  };

  return (
    <div
      className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: exiting ? 0 : 1,
        transition: 'opacity 0.4s ease-out',
        zIndex: 100,
      }}
    >
      <style>{splashStyles}</style>

      {/* Crawling snail */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          animation: 'snailCrawl 10s linear forwards',
          pointerEvents: 'none',
        }}
      >
        <div style={{ animation: 'snailDrag 1.4s ease-in-out infinite' }}>
          <div style={{ animation: 'shellSway 2.2s ease-in-out infinite', transformOrigin: 'center bottom' }}>
            {/* scaleX(-1) flips to face right */}
            <div style={{ transform: 'scaleX(-1)' }}>
              <SnailSVG />
            </div>
          </div>
        </div>
      </div>

      {/* Title */}
      <div
        className="relative z-10 text-center"
        style={{ animation: 'titleAppear 0.7s ease-out 0.2s both' }}
      >
        <h1
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.8rem, 8vw, 5rem)',
            color: '#3E3831',
            letterSpacing: '0.04em',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}
        >
          snail mail
        </h1>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '11px',
            color: '#8B7355',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            opacity: 0.8,
          }}
        >
          handwritten letters, delivered slow
        </p>
      </div>

      {/* Create Letter button */}
      {showButton && (
        <button
          onClick={handleEnter}
          style={{
            marginTop: '3rem',
            padding: '16px 52px',
            background: '#1C1917',
            color: '#FEFDFB',
            border: 'none',
            letterSpacing: '0.18em',
            fontSize: '11px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
            animation: 'fadeSlideUp 0.5s cubic-bezier(0.34,1.2,0.64,1) both',
            position: 'relative',
            zIndex: 10,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3E3831')}
          onMouseLeave={e => (e.currentTarget.style.background = '#1C1917')}
        >
          Create a letter →
        </button>
      )}

      {/* Subtle corner stars */}
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', top: 32, left: 32, opacity: 0.25 }}>
        <path d="M10 1 L10 19 M1 10 L19 10 M3 3 L17 17 M17 3 L3 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', top: 48, right: 40, opacity: 0.2 }}>
        <path d="M10 1 L10 19 M1 10 L19 10 M3 3 L17 17 M17 3 L3 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', bottom: 40, right: 48, opacity: 0.2 }}>
        <path d="M10 1 L10 19 M1 10 L19 10 M3 3 L17 17 M17 3 L3 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none" style={{ position: 'absolute', bottom: 36, left: 44, opacity: 0.18 }}>
        <path d="M10 1 L10 19 M1 10 L19 10 M3 3 L17 17 M17 3 L3 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

export { splashStyles };
