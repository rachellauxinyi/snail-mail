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
    <svg width="82" height="52" viewBox="0 0 110 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Foot — tapered elongated base */}
      <path d="M6 48 Q3 54 9 58 Q30 64 68 62 Q86 60 94 53 Q97 47 88 44 Q76 42 56 44 Q32 46 14 48 Q8 48 6 48Z"
            fill="#F5F0E8" stroke="#3E3831" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* Upper body / neck */}
      <path d="M18 46 Q10 38 11 28 Q12 18 20 14 Q30 10 36 18 Q42 26 38 38 Q34 46 22 48Z"
            fill="#F5F0E8" stroke="#3E3831" strokeWidth="1.3" strokeLinejoin="round"/>
      {/* Shell — large circle */}
      <circle cx="68" cy="30" r="26" fill="#FAF6F0" stroke="#3E3831" strokeWidth="1.6"/>
      {/* Spiral — one arc per turn, offset centers give coiling feel */}
      <path d="M68 8 A22 22 0 1 0 46.5 42" stroke="#3E3831" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M68 14 A16 16 0 1 0 52.5 42" stroke="#3E3831" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M68 20 A10 10 0 1 0 58.5 38" stroke="#3E3831" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <circle cx="68" cy="30" r="3.5" fill="none" stroke="#3E3831" strokeWidth="0.7"/>
      <circle cx="68" cy="30" r="1.2" fill="#3E3831" opacity="0.5"/>
      {/* Long antenna */}
      <path d="M14 14 C11 6 9 1 7 -4" stroke="#3E3831" strokeWidth="1.1" strokeLinecap="round"/>
      <circle cx="7" cy="-5" r="2" fill="#3E3831"/>
      {/* Short antenna */}
      <path d="M21 12 C19 5 17 1 16 -3" stroke="#3E3831" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="16" cy="-4" r="1.6" fill="#3E3831"/>
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
          top: '58%',
          left: 0, right: 0,
          transform: 'translateY(-50%)',
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
