import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

type Phase = 'loading' | 'intro' | 'sealed' | 'flipped' | 'unfolding' | 'reading';

const STARS = [
  { x: 8,  y: 12, s: 14, d: 0.0, op: 0.9 },
  { x: 88, y: 8,  s: 10, d: 0.3, op: 0.7 },
  { x: 3,  y: 55, s: 8,  d: 0.6, op: 0.8 },
  { x: 94, y: 50, s: 12, d: 0.2, op: 0.9 },
  { x: 18, y: 88, s: 9,  d: 0.8, op: 0.7 },
  { x: 78, y: 85, s: 11, d: 0.5, op: 0.8 },
  { x: 50, y: 4,  s: 7,  d: 1.0, op: 0.6 },
  { x: 38, y: 93, s: 8,  d: 0.4, op: 0.7 },
  { x: 65, y: 6,  s: 10, d: 0.7, op: 0.8 },
  { x: 25, y: 5,  s: 6,  d: 0.9, op: 0.6 },
];

function StarBurst({ visible }: { visible: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s' }}>
      {STARS.map((st, i) => (
        <div key={i} className="absolute" style={{ left: `${st.x}%`, top: `${st.y}%`, opacity: st.op }}>
          <svg width={st.s} height={st.s} viewBox="0 0 20 20" fill="none" style={{ animation: `letterStarPulse 2s ease-in-out ${st.d}s infinite` }}>
            <path d="M10 1 L11.5 8 L18 10 L11.5 12 L10 19 L8.5 12 L2 10 L8.5 8 Z" fill="#8B7355" opacity="0.6"/>
          </svg>
        </div>
      ))}
    </div>
  );
}

const styles = `
@keyframes letterStarPulse { 0%,100%{transform:scale(1) rotate(0deg);opacity:0.6} 50%{transform:scale(1.3) rotate(15deg);opacity:1} }
@keyframes envAppear { from{transform:scale(0.7) translateY(30px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
@keyframes letterSlideUp { from{transform:translateY(0)} to{transform:translateY(-120px)} }
@keyframes letterUnfold { from{transform:scaleY(0.4) translateY(60px);transform-origin:top;opacity:0} to{transform:scaleY(1) translateY(0);transform-origin:top;opacity:1} }
`;

export function LetterView({ letterId }: { letterId: string }) {
  const [letter, setLetter] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [flipped, setFlipped] = useState(false);
  const [letterOut, setLetterOut] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4ba6ddf6/letter/${letterId}`,
          { headers: { Authorization: `Bearer ${publicAnonKey}` } }
        );
        if (!res.ok) {
          const err = await res.json();
          setError(err.error || 'Failed to load letter');
          setPhase('reading');
          return;
        }
        const data = await res.json();
        setLetter(data.letter);
        setPhase('intro');
        // After intro animation, settle into "sealed" state waiting for click
        setTimeout(() => setPhase('sealed'), 2200);
      } catch {
        setError('Failed to load letter');
        setPhase('reading');
      }
    })();
  }, [letterId]);

  const handleEnvelopeClick = () => {
    if (phase === 'sealed') {
      // First click: flip to back
      setFlipped(true);
      setPhase('flipped');
    } else if (phase === 'flipped') {
      // Second click: letter slides out then unfolds
      setLetterOut(true);
      setPhase('unfolding');
      setTimeout(() => {
        setLetterOpen(true);
        setTimeout(() => setPhase('reading'), 700);
      }, 600);
    }
  };

  const getTextureStyle = (t: string) => {
    switch (t) {
      case 'aged':      return '#F5F0E8';
      case 'parchment': return '#F2EDE3';
      case 'kraft':     return '#E8DCC8';
      default:          return '#FFF9F0';
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center">
        <style>{styles}</style>
        <p style={{ fontFamily: 'monospace', letterSpacing: '0.18em', fontSize: '11px', color: '#6B6256', textTransform: 'uppercase' }}>
          Fetching your letter…
        </p>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
        <style>{styles}</style>
        <div className="max-w-md text-center bg-[#FEFDFB] border-2 border-[#D4CFC5] p-8">
          <h2 className="text-[#3E3831] text-2xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>Oops!</h2>
          <p className="text-[#6B6256] mb-4">{error}</p>
          <p className="text-[#8B7355] text-sm italic">
            {error.includes('not yet delivered')
              ? "This letter hasn't arrived yet. Check back in a few days!"
              : 'This letter may have been lost in the mail.'}
          </p>
        </div>
      </div>
    );
  }

  const fromCity = letter?.senderCity || letter?.location || 'somewhere special';
  const toCity   = letter?.receiverCity || '';
  const toName   = letter?.recipientName || 'You';
  const bgColor  = getTextureStyle(letter?.paperTexture);

  // ── Envelope phases (intro / sealed / flipped / unfolding) ───────────────
  if (phase !== 'reading') {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden relative select-none">
        <style>{styles}</style>
        <StarBurst visible={phase === 'intro' || phase === 'sealed'} />

        {/* Header */}
        <div className="relative z-10 text-center mb-10">
          <h1 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2rem', color: '#3E3831', letterSpacing: '0.04em' }}>
            📬 snail mail
          </h1>
          <p style={{ color: '#6B6256', fontStyle: 'italic', fontSize: '14px', marginTop: '4px' }}>
            {phase === 'intro' ? "You've got mail! 💌" : phase === 'flipped' ? 'Tap to open your letter →' : 'Tap the envelope to peek inside →'}
          </p>
        </div>

        {/* 3-D envelope wrapper */}
        <div
          className="relative z-10"
          style={{ perspective: '1200px', cursor: phase === 'sealed' || phase === 'flipped' ? 'pointer' : 'default' }}
          onClick={handleEnvelopeClick}
        >
          <div style={{
            width: 340,
            height: 220,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.9s cubic-bezier(0.4,0,0.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            animation: phase === 'intro' ? 'envAppear 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
          }}>

            {/* ── FRONT FACE ── */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              background: '#FAF6F0',
              border: '2px solid #A89478',
              borderRadius: 4,
              overflow: 'hidden',
            }}>
              {/* Envelope fold triangles */}
              <div style={{ position: 'absolute', inset: 0 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#A8947808', clipPath: 'polygon(0 0, 100% 0, 50% 42%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#A8947805', clipPath: 'polygon(0 0, 0 100%, 44% 50%)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#A8947805', clipPath: 'polygon(100% 0, 100% 100%, 56% 50%)' }} />
              </div>
              {/* Stamp placeholder */}
              <div style={{ position: 'absolute', top: 10, right: 10, width: 44, height: 52, background: 'linear-gradient(135deg,#F5E8D8,#E8D8C8)', border: '2px solid #FEFDFB', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                ✉️
              </div>
              {/* From label */}
              <div style={{ position: 'absolute', left: 20, top: '42%', transform: 'translateY(-50%)' }}>
                <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 15, color: '#3E3831' }}>from {fromCity}</div>
              </div>
              {/* To label */}
              <div style={{ position: 'absolute', bottom: 12, right: 14, textAlign: 'right' }}>
                <div style={{ fontSize: 8, color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 2 }}>TO</div>
                <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: '#3E3831' }}>{toName}</div>
              </div>
            </div>

            {/* ── BACK FACE (flipped 180°) ── */}
            <div style={{
              position: 'absolute', inset: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: '#FAF6F0',
              border: '2px solid #A89478',
              borderRadius: 4,
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {/* Triangular flap open */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: '#F0EAE0', clipPath: 'polygon(0 0, 100% 0, 50% 100%)', borderBottom: '1.5px solid #A89478' }} />
              <div style={{ position: 'absolute', bottom: 16, fontSize: 11, color: '#8B7355', letterSpacing: '0.12em', textTransform: 'uppercase', fontStyle: 'italic' }}>
                tap to open →
              </div>
            </div>
          </div>

          {/* Letter sliding out (visible when unfolding) */}
          {letterOut && (
            <div style={{
              position: 'absolute',
              left: '50%', bottom: '50%',
              transform: `translateX(-50%) translateY(${letterOpen ? '-160px' : '0px'})`,
              transition: 'transform 0.5s ease-out',
              width: 260,
              background: bgColor,
              border: '1.5px solid #D4CFC5',
              borderRadius: 2,
              padding: '16px 20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              zIndex: 10,
              transformOrigin: 'bottom center',
              animation: letterOpen ? 'letterUnfold 0.6s cubic-bezier(0.34,1.2,0.64,1) forwards' : 'none',
            }}>
              <div style={{ fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 13, color: '#6B6256', marginBottom: 10 }}>Dear {toName},</div>
              <div style={{ color: '#3E3831', fontSize: 13, lineHeight: 1.6, fontFamily: 'serif' }}>
                {(letter?.letterText || '').slice(0, 80)}{(letter?.letterText || '').length > 80 ? '…' : ''}
              </div>
            </div>
          )}
        </div>

        {/* From → To caption under envelope */}
        <div className="relative z-10 text-center mt-6">
          <p style={{ fontFamily: 'monospace', fontSize: 11, color: '#8B7355', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            {fromCity}{toCity ? ` → ${toCity}` : ''}
          </p>
        </div>
      </div>
    );
  }

  // ── Reading phase (full letter) ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F4F0] p-8 relative overflow-hidden">
      <style>{styles}</style>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0' fill='%23000000'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-4xl mx-auto relative">
        <header className="text-center mb-12">
          <h1 className="text-[#3E3831] lowercase mb-3" style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>
            📬 snail mail
          </h1>
          <p className="text-[#6B6256] italic">You've got mail! 💌</p>
        </header>

        <div className="flex justify-center" style={{ animation: 'envAppear 0.6s cubic-bezier(0.34,1.2,0.64,1) forwards' }}>
          <div
            className="w-full max-w-[500px] shadow-2xl border-2 p-8 relative"
            style={{ background: bgColor, borderColor: '#8B735540' }}
          >
            <div className="space-y-6 relative">
              <div className="text-right text-sm text-[#6B6256] italic">
                From {fromCity}
              </div>

              <div className="text-[#3E3831] font-serif text-lg mb-4">
                Dear {toName},
              </div>

              <div className="text-[#3E3831] font-serif whitespace-pre-wrap leading-relaxed">
                {letter.letterText || 'A special message just for you...'}
              </div>

              {letter.signature && (
                <div className="mt-12 flex justify-end">
                  <img src={letter.signature} alt="Signature" className="h-20 w-auto" />
                </div>
              )}

              <div className="mt-12 pt-6 border-t-2 border-dashed border-[#D4CFC5] text-center">
                <p className="text-[#6B6256] mb-4 italic">Want to send a letter back? 💌</p>
                <a
                  href="https://venue-sienna-69575773.figma.site"
                  className="inline-block px-8 py-4 bg-[#8B7355] text-[#FEFDFB] border-2 border-[#8B7355] hover:bg-[#6B5335] transition-colors text-lg"
                  style={{ fontFamily: '"Instrument Serif", serif', letterSpacing: '0.05em' }}
                >
                  Create Now!
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-[#8B7355] italic">
          Delivered with whimsy ✦
        </div>
      </div>
    </div>
  );
}
