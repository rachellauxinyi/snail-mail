import { useState, useEffect } from 'react';

const splashStyles = `
@keyframes snailCrawl {
  from { transform: translateX(-180px); }
  to   { transform: translateX(calc(100vw + 180px)); }
}
@keyframes snailDrag {
  0%   { transform: translateY(0px) rotate(0deg); }
  15%  { transform: translateY(2px) rotate(1.5deg); }
  35%  { transform: translateY(-2px) rotate(-0.5deg); }
  55%  { transform: translateY(3px) rotate(1deg); }
  75%  { transform: translateY(-1px) rotate(-0.8deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes shellSway {
  0%,100% { transform: rotate(0deg) translateY(0px); }
  40%     { transform: rotate(3deg) translateY(-1px); }
  70%     { transform: rotate(-2deg) translateY(1px); }
}
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(14px); }
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
@keyframes starPulse {
  0%,100% { opacity: var(--op); transform: scale(1) rotate(0deg); }
  50%     { opacity: calc(var(--op) * 1.6); transform: scale(1.2) rotate(12deg); }
}
`;

const STARS = [
  { x: 6,  y: 5,  s: 18, d: 0.0, op: 0.22 },
  { x: 88, y: 4,  s: 14, d: 0.5, op: 0.18 },
  { x: 94, y: 18, s: 10, d: 1.1, op: 0.14 },
  { x: 3,  y: 22, s: 12, d: 0.3, op: 0.16 },
  { x: 50, y: 3,  s: 11, d: 0.8, op: 0.15 },
  { x: 18, y: 8,  s: 9,  d: 1.4, op: 0.13 },
  { x: 72, y: 7,  s: 13, d: 0.2, op: 0.17 },
  { x: 35, y: 6,  s: 8,  d: 0.9, op: 0.12 },
  { x: 5,  y: 50, s: 14, d: 0.6, op: 0.20 },
  { x: 95, y: 45, s: 16, d: 0.1, op: 0.22 },
  { x: 8,  y: 75, s: 12, d: 1.2, op: 0.18 },
  { x: 92, y: 70, s: 10, d: 0.7, op: 0.15 },
  { x: 4,  y: 88, s: 16, d: 0.4, op: 0.20 },
  { x: 90, y: 90, s: 14, d: 1.0, op: 0.18 },
  { x: 50, y: 92, s: 10, d: 0.3, op: 0.14 },
  { x: 25, y: 90, s: 8,  d: 1.3, op: 0.13 },
  { x: 75, y: 88, s: 11, d: 0.6, op: 0.16 },
  { x: 20, y: 50, s: 9,  d: 1.5, op: 0.12 },
  { x: 80, y: 55, s: 8,  d: 0.9, op: 0.13 },
  { x: 60, y: 95, s: 9,  d: 0.2, op: 0.14 },
];

function Star({ x, y, s, d, op }: { x: number; y: number; s: number; d: number; op: number }) {
  return (
    <svg
      width={s} height={s} viewBox="0 0 20 20" fill="none"
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        // @ts-ignore
        '--op': op,
        animation: `starPulse ${2.2 + d}s ease-in-out ${d}s infinite`,
        opacity: op,
        pointerEvents: 'none',
      }}
    >
      <path d="M10 1 L10 19 M1 10 L19 10 M3 3 L17 17 M17 3 L3 17" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function SnailSVG() {
  return (
    <svg width="160" height="88" viewBox="0 0 160 88" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 64 Q2 70 8 75 Q34 82 90 80 Q120 79 136 72 Q144 66 136 60 Q122 56 98 58 Q60 60 28 64 Q14 66 6 64Z"
            fill="#F5F0E8" stroke="#2C2420" strokeWidth="1.4" strokeLinejoin="round"/>
      <path d="M26 62 Q16 56 14 46 Q12 34 20 24 Q28 14 40 18 Q54 22 56 36 Q58 50 46 60 Q38 66 26 62Z"
            fill="#F5F0E8" stroke="#2C2420" strokeWidth="1.4" strokeLinejoin="round"/>
      <circle cx="102" cy="42" r="34" fill="#F8F3EA" stroke="#2C2420" strokeWidth="1.8"/>
      <circle cx="102" cy="42" r="26" fill="none" stroke="#2C2420" strokeWidth="1.1"/>
      <circle cx="102" cy="42" r="18" fill="none" stroke="#2C2420" strokeWidth="1.0"/>
      <circle cx="102" cy="42" r="10" fill="none" stroke="#2C2420" strokeWidth="0.9"/>
      <circle cx="102" cy="42" r="4"  fill="none" stroke="#2C2420" strokeWidth="0.8"/>
      <circle cx="102" cy="42" r="2"  fill="#2C2420" opacity="0.45"/>
      <path d="M102 8 A34 34 0 0 0 68 42" stroke="#2C2420" strokeWidth="0.8" fill="none" opacity="0.5"/>
      <path d="M102 16 A26 26 0 0 0 76 42" stroke="#2C2420" strokeWidth="0.7" fill="none" opacity="0.4"/>
      <path d="M30 46 Q38 44 46 46" stroke="#2C2420" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.4"/>
      <path d="M28 52 Q36 50 44 52" stroke="#2C2420" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.35"/>
      <path d="M52 76 L52 72" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M64 78 L64 73" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M76 78 L76 74" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M88 77 L88 73" stroke="#2C2420" strokeWidth="0.8" strokeLinecap="round" opacity="0.3"/>
      <path d="M22 20 C18 10 14 4 10 -2" stroke="#2C2420" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="10" cy="-3" r="2.8" fill="#2C2420"/>
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
    const t = setTimeout(() => setShowButton(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 420);
  };

  return (
    <div
      className="fixed inset-0 bg-[#F7F4F0] overflow-hidden"
      style={{ opacity: exiting ? 0 : 1, transition: 'opacity 0.4s ease-out', zIndex: 100 }}
    >
      <style>{splashStyles}</style>

      {/* Background stars */}
      {STARS.map((s, i) => <Star key={i} {...s} />)}

      {/* Snail — crawls at a fixed vertical position, independently of content below */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 90px)',
          left: 0,
          animation: 'snailCrawl 16s linear forwards',
          pointerEvents: 'none',
          zIndex: 20,
        }}
      >
        <div style={{ transform: 'translateY(-50%)' }}>
          <div style={{ animation: 'snailDrag 1.6s ease-in-out infinite' }}>
            <div style={{ animation: 'shellSway 2.4s ease-in-out infinite', transformOrigin: 'center bottom' }}>
              <div style={{ transform: 'scaleX(-1)' }}>
                <SnailSVG />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Title + button — absolutely positioned so button appearing never shifts the title */}
      <div
        style={{
          position: 'absolute',
          bottom: '50%',
          left: 0, right: 0,
          transform: 'translateY(50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          zIndex: 10,
        }}
      >
        <div
          className="text-center"
          style={{ animation: 'titleAppear 0.7s ease-out 0.2s both' }}
        >
          <h1 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#3E3831',
            letterSpacing: '0.06em',
            lineHeight: 1,
            marginBottom: '0.4rem',
          }}>
            snail mail
          </h1>
          <p style={{
            fontFamily: 'monospace',
            fontSize: '10px',
            color: '#8B7355',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}>
            handwritten letters, delivered slow
          </p>
        </div>

        {/* Button sits below title — absolutely positioned so it doesn't push title up */}
        <div style={{ height: '51px', display: 'flex', alignItems: 'center' }}>
          {showButton && (
            <button
              onClick={handleEnter}
              style={{
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
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#3E3831')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1C1917')}
            >
              Create a letter →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { splashStyles };
