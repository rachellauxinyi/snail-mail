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
    <svg width="160" height="88" viewBox="0 0 160 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Foot — long tapered base */}
      <path d="M6 64 Q2 70 8 75 Q34 82 90 80 Q120 79 136 72 Q144 66 136 60 Q122 56 98 58 Q60 60 28 64 Q14 66 6 64Z"
            fill="#F5F0E8" stroke="#2C2420" strokeWidth="1.4" strokeLinejoin="round"/>

      {/* Upper body / mantle — organic form, head area on left */}
      <path d="M26 62 Q16 56 14 46 Q12 34 20 24 Q28 14 40 18 Q54 22 56 36 Q58 50 46 60 Q38 66 26 62Z"
            fill="#F5F0E8" stroke="#2C2420" strokeWidth="1.4" strokeLinejoin="round"/>

      {/* Shell — large circle on top */}
      <circle cx="102" cy="42" r="34" fill="#F8F3EA" stroke="#2C2420" strokeWidth="1.8"/>

      {/* Shell spiral — concentric rings */}
      <circle cx="102" cy="42" r="26" fill="none" stroke="#2C2420" strokeWidth="1.1"/>
      <circle cx="102" cy="42" r="18" fill="none" stroke="#2C2420" strokeWidth="1.0"/>
      <circle cx="102" cy="42" r="10" fill="none" stroke="#2C2420" strokeWidth="0.9"/>
      <circle cx="102" cy="42" r="4"  fill="none" stroke="#2C2420" strokeWidth="0.8"/>

      {/* Spiral centre dot */}
      <circle cx="102" cy="42" r="2" fill="#2C2420" opacity="0.45"/>

      {/* Spiral connecting arc — gives it a real coiled look */}
      <path d="M102 8 A34 34 0 0 0 68 42" stroke="#2C2420" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M102 16 A26 26 0 0 0 76 42" stroke="#2C2420" strokeWidth="0.7" fill="none" opacity="0.4"/>

      {/* Body texture / crease lines */}
      <path d="M30 46 Q38 44 46 46" stroke="#2C2420" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M28 52 Q36 50 44 52" stroke="#2C2420" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.35"/>

      {/* Foot texture marks */}
      <path d="M52 76 L52 72" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M64 78 L64 73" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M76 78 L76 74" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M88 77 L88 73" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>

      {/* Long upper antenna (eye stalk) */}
      <path d="M22 20 C18 10 14 4 10 -2" stroke="#2C2420" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="10" cy="-3" r="2.8" fill="#2C2420"/>

      {/* Short lower antenna */}
      <path d="M30 18 C28 10 26 4 24 0" stroke="#2C2420" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="24" cy="-1" r="2.2" fill="#2C2420"/>
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

      {/* Crawling snail — outer handles horizontal crawl, inner handles vertical centering */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 80px)',
          left: 0,
          animation: 'snailCrawl 10s linear forwards',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        {/* Separate div so translateY(-50%) isn't overridden by the crawl animation */}
        <div style={{ transform: 'translateY(-50%)' }}>
          <div style={{ animation: 'snailDrag 1.4s ease-in-out infinite' }}>
            <div style={{ animation: 'shellSway 2.2s ease-in-out infinite', transformOrigin: 'center bottom' }}>
              <div style={{ transform: 'scaleX(-1)' }}>
                <SnailSVG />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title — snail crawls directly over this */}
      <div
        className="relative z-10 text-center"
        style={{ animation: 'titleAppear 0.7s ease-out 0.2s both' }}
      >
        <h1
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#3E3831',
            letterSpacing: '0.06em',
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}
        >
          snail mail
        </h1>
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#8B7355',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.7,
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
            marginTop: '2.4rem',
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
