import { useState, useRef, useEffect } from 'react';
import { Lock, MailOpen } from 'lucide-react';
import { CustomizationPanel } from './components/CustomizationPanel';
import { MailPreview } from './components/MailPreview';
import { ExportOptions } from './components/ExportOptions';
import html2canvas from 'html2canvas';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

function parseDeepLink(href: string): { mode: 'tracker' | 'view'; letterId: string } | null {
  // Query param ?t= survives Figma Sites server-side redirect; check it first
  try {
    const url = new URL(href);
    const t = url.searchParams.get('t');
    if (t) return { mode: 'tracker', letterId: t };
  } catch {}
  // Hash fragments work for local dev and direct navigation
  const trackerMatch = href.match(/#tracker\/([^\/\?\&\s]+)/);
  if (trackerMatch) return { mode: 'tracker', letterId: trackerMatch[1] };
  const viewMatch = href.match(/#\/view\/([^\/\?\&\s]+)/);
  if (viewMatch) return { mode: 'view', letterId: viewMatch[1] };
  return null;
}

function getInitialViewMode(): { mode: 'create' | 'tracker' | 'view'; letterId?: string } {
  const saved = sessionStorage.getItem('snailmail_route');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.mode && parsed.mode !== 'create') return parsed;
    } catch {}
  }
  const deepLink = parseDeepLink(window.location.href);
  if (deepLink) {
    sessionStorage.setItem('snailmail_route', JSON.stringify(deepLink));
    return deepLink;
  }
  if (document.referrer) {
    const refLink = parseDeepLink(document.referrer);
    if (refLink) {
      sessionStorage.setItem('snailmail_route', JSON.stringify(refLink));
      return refLink;
    }
  }
  return { mode: 'create' };
}

function formatRealCountdown(letterId: string): string {
  const match = letterId.match(/letter_(\d+)_/);
  if (!match) return '00:00:00';
  const sentAt = parseInt(match[1]);
  const deliveryAt = sentAt + 30 * 1000;
  const remaining = Math.max(0, deliveryAt - Date.now());
  if (remaining === 0) return '00:00:00';
  const s = Math.floor(remaining / 1000) % 60;
  const m = Math.floor(remaining / 60000) % 60;
  const h = Math.floor(remaining / 3600000);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function generateStampData(letterId: string, location?: string): { from: string; to: string; progress: number } {
  const match = letterId.match(/letter_(\d+)_/);
  const sentAt = match ? parseInt(match[1]) : Date.now();
  const deliveryAt = sentAt + 30 * 1000;
  const progress = Math.min(1, Math.max(0, (Date.now() - sentAt) / (deliveryAt - sentAt)));
  return { from: location || 'Somewhere', to: 'Your Mailbox', progress };
}

export default function App() {
  const [viewMode, setViewMode] = useState<{ mode: 'create' | 'tracker' | 'view'; letterId?: string }>(getInitialViewMode);
  const [senderView, setSenderView] = useState<'compose' | 'sending' | 'success'>('compose');
  const [sentLetterId, setSentLetterId] = useState<string | null>(null);

  const [letter, setLetter] = useState<any>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [letterError, setLetterError] = useState<string | null>(null);
  const [trackerStatus, setTrackerStatus] = useState<'transit' | 'delivered' | null>(null);

  const [paperTexture, setPaperTexture] = useState('cream');
  const [envelopeStyle, setEnvelopeStyle] = useState('classic');
  const [location, setLocation] = useState('Paris');
  const [recipientName, setRecipientName] = useState('Someone Special');
  const [letterText, setLetterText] = useState('');
  const [signature, setSignature] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<Array<{
    id: string;
    url: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>>([]);
  const [decorations, setDecorations] = useState<Array<{
    id: string;
    type: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>>([]);

  const [countdown, setCountdown] = useState('');

  const previewRef = useRef<HTMLDivElement>(null);

  // Live countdown timer for in-transit tracker
  useEffect(() => {
    if (viewMode.mode !== 'tracker' || !viewMode.letterId || trackerStatus !== 'transit') return;
    const tick = () => setCountdown(formatRealCountdown(viewMode.letterId!));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [viewMode, trackerStatus]);

  // Capture deep link on mount, save to sessionStorage to survive Figma Sites redirect
  useEffect(() => {
    const href = window.location.href;
    const deepLink = parseDeepLink(href);
    if (deepLink) {
      sessionStorage.setItem('snailmail_route', JSON.stringify(deepLink));
      setViewMode(deepLink);
      return;
    }
    const saved = sessionStorage.getItem('snailmail_route');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.mode && parsed.mode !== 'create') {
          setViewMode(parsed);
          return;
        }
      } catch {}
    }
    const handleHashChange = () => {
      const link = parseDeepLink(window.location.href);
      if (link) {
        sessionStorage.setItem('snailmail_route', JSON.stringify(link));
        setViewMode(link);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Fetch letter when in view or tracker mode
  useEffect(() => {
    if ((viewMode.mode === 'view' || viewMode.mode === 'tracker') && viewMode.letterId) {
      const fetchLetter = async () => {
        setLetterLoading(true);
        setLetterError(null);
        try {
          const response = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-4ba6ddf6/letter/${viewMode.letterId}`,
            { headers: { 'Authorization': `Bearer ${publicAnonKey}` } }
          );

          if (response.status === 403) {
            setTrackerStatus('transit');
            setLetterLoading(false);
            return;
          }

          if (!response.ok) {
            const errorData = await response.json();
            setLetterError(errorData.error || 'Failed to load letter');
            setLetterLoading(false);
            return;
          }

          const data = await response.json();
          setLetter(data.letter);
          setTrackerStatus('delivered');
          setLetterLoading(false);
        } catch (err) {
          setLetterError('Failed to load letter');
          setLetterLoading(false);
        }
      };
      fetchLetter();
    }
  }, [viewMode]);

  const handleLetterSent = (letterId: string) => {
    setSentLetterId(letterId);
    setSenderView('success');
  };

  const handleDownload = async () => {
    if (!previewRef.current) return;
    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#F7F4F0',
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `snail-mail-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const STAR_DATA = [
    { x: 6,   y: 9,  size: 20, rotation: 15,  delay: 0.0  },
    { x: 22,  y: 3,  size: 16, rotation: 40,  delay: 0.3  },
    { x: 44,  y: 7,  size: 14, rotation: -10, delay: 0.5  },
    { x: 65,  y: 4,  size: 18, rotation: 60,  delay: 0.1  },
    { x: 84,  y: 10, size: 15, rotation: -45, delay: 0.4  },
    { x: 94,  y: 28, size: 17, rotation: 25,  delay: 0.2  },
    { x: 91,  y: 55, size: 13, rotation: 70,  delay: 0.6  },
    { x: 88,  y: 78, size: 19, rotation: -30, delay: 0.35 },
    { x: 72,  y: 90, size: 14, rotation: 50,  delay: 0.15 },
    { x: 50,  y: 94, size: 16, rotation: -55, delay: 0.45 },
    { x: 28,  y: 91, size: 12, rotation: 20,  delay: 0.25 },
    { x: 8,   y: 82, size: 18, rotation: -15, delay: 0.55 },
    { x: 3,   y: 58, size: 15, rotation: 35,  delay: 0.1  },
    { x: 5,   y: 35, size: 13, rotation: -60, delay: 0.4  },
    { x: 33,  y: 20, size: 11, rotation: 80,  delay: 0.2  },
    { x: 75,  y: 18, size: 14, rotation: -25, delay: 0.5  },
  ];

  const psStarPulseStyle = `
    @keyframes psStarPulse {
      0%, 100% { opacity: 0.55; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.18); }
    }
    @keyframes psDot1 { 0%,66%,100%{opacity:0.2} 22%{opacity:1} }
    @keyframes psDot2 { 0%,22%,88%,100%{opacity:0.2} 55%{opacity:1} }
    @keyframes psDot3 { 0%,44%,100%{opacity:0.2} 77%{opacity:1} }
  `;

  const StarBg = () => (
    <>
      {STAR_DATA.map((s, i) => (
        <div key={i} className="absolute pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`,
            animation: `psStarPulse ${2 + i * 0.12}s ease-in-out infinite`,
            animationDelay: `${s.delay}s` }}>
          <svg width={s.size} height={s.size} viewBox="0 0 20 20" fill="none"
            style={{ transform: `rotate(${s.rotation}deg)` }}>
            <path d="M10 1 L10 19 M1 10 L19 10 M3.5 3.5 L16.5 16.5 M16.5 3.5 L3.5 16.5"
              stroke="#B8AFA6" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      ))}
    </>
  );

  // Tracker view
  if (viewMode.mode === 'tracker' && viewMode.letterId) {
    const lid = viewMode.letterId;
    const isDelivered = trackerStatus === 'delivered';
    const stamps = generateStampData(lid, letter?.location);

    if (letterLoading) {
      return (
        <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
          <style>{psStarPulseStyle}</style>
          <StarBg />
          <div className="relative z-10 text-center" style={{ animation: 'psStarPulse 1.6s ease-in-out infinite' }}>
            <svg width="80" height="64" viewBox="0 0 80 64" fill="none" className="mx-auto mb-4">
              <rect x="4" y="14" width="62" height="42" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
              <path d="M4 14 L35 36 L66 14" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            </svg>
            <p style={{ fontFamily: 'monospace', letterSpacing: '0.18em', fontSize: '11px', color: '#6B6256', textTransform: 'uppercase' }}>
              Loading your tracking page…
            </p>
          </div>
        </div>
      );
    }

    if (letterError && !trackerStatus) {
      return (
        <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
          <style>{psStarPulseStyle}</style>
          <StarBg />
          <div className="relative z-10 flex flex-col items-center gap-3 text-center px-8">
            <svg width="80" height="64" viewBox="0 0 80 64" fill="none">
              <rect x="4" y="14" width="62" height="42" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
              <path d="M4 14 L35 36 L66 14" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <line x1="28" y1="32" x2="42" y2="32" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
              <line x1="35" y1="25" x2="35" y2="39" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.6rem', color: '#3E3831' }}>
              Tracking link expired
            </h2>
            <button
              onClick={() => { sessionStorage.removeItem('snailmail_route'); setViewMode({ mode: 'create' }); }}
              style={{ color: '#8B7355', fontSize: '13px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Send a letter →
            </button>
            <p style={{ color: '#8B7355', fontSize: '12px', fontStyle: 'italic', marginTop: '8px' }}>
              Delivered with patience ✦ snail mail
            </p>
          </div>
        </div>
      );
    }

    if (isDelivered) {
      return (
        <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
          <style>{psStarPulseStyle}</style>
          <StarBg />
          <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8 max-w-md">
            {/* Envelope with teal checkmark — same as success screen */}
            <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
              <rect x="5" y="24" width="80" height="56" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
              <path d="M5 24 L45 54 L85 24" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
              <rect x="26" y="17" width="38" height="21" rx="1" fill="#FEFDFB" stroke="#A89478" strokeWidth="1.2"/>
              <line x1="32" y1="25" x2="58" y2="25" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
              <line x1="32" y1="30" x2="58" y2="30" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
              <line x1="32" y1="35" x2="50" y2="35" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
              <circle cx="76" cy="68" r="14" fill="#5B9E8A"/>
              <path d="M69 68 L74 73.5 L83 62" stroke="#FEFDFB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2rem', color: '#3E3831', letterSpacing: '0.02em', lineHeight: 1.2 }}>
              Your letter has arrived!
            </h2>
            <p style={{ color: '#6B6256', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
              Your mail has completed its journey. Click below to read your message.
            </p>
            <button
              onClick={() => {
                const newMode = { mode: 'view' as const, letterId: lid };
                sessionStorage.setItem('snailmail_route', JSON.stringify(newMode));
                setViewMode(newMode);
              }}
              style={{ marginTop: '8px', padding: '15px 44px', background: '#1C1917', color: '#FEFDFB',
                border: 'none', letterSpacing: '0.18em', fontSize: '11px', textTransform: 'uppercase',
                cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
            >
              Open Your Letter
            </button>
            <p style={{ color: '#8B7355', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>
              Delivered with patience ✦ snail mail
            </p>
          </div>
        </div>
      );
    }

    // In-transit state
    return (
      <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
        <style>{psStarPulseStyle}</style>
        <StarBg />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8 max-w-md">
          {/* Envelope with motion lines */}
          <svg width="130" height="96" viewBox="0 0 130 96" fill="none">
            <rect x="5" y="18" width="96" height="64" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
            <path d="M5 18 L53 54 L101 18" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            <rect x="32" y="15" width="42" height="21" rx="1" fill="#FEFDFB" stroke="#A89478" strokeWidth="1.2"/>
            <line x1="38" y1="23" x2="68" y2="23" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="38" y1="28" x2="68" y2="28" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="38" y1="33" x2="60" y2="33" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="110" y1="42" x2="124" y2="42" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="113" y1="52" x2="124" y2="52" stroke="#A89478" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
          </svg>

          <div>
            <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2rem', color: '#3E3831', letterSpacing: '0.02em', lineHeight: 1.2, marginBottom: '6px' }}>
              Mail in Transit
            </h2>
            <p style={{ color: '#6B6256', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
              Slowly making its way to you…
            </p>
          </div>

          {/* Route progress */}
          <div style={{ width: '100%', maxWidth: '320px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>{stamps.from}</span>
              <div style={{ flex: 1, height: '1px', background: '#D4CFC5', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: '#8B7355', width: `${stamps.progress * 100}%`, transition: 'width 1s' }} />
                <div style={{ position: 'absolute', top: '50%', transform: 'translate(-50%, -50%)', width: '8px', height: '8px', borderRadius: '50%', background: '#8B7355', border: '2px solid #F7F4F0', left: `${stamps.progress * 100}%`, transition: 'left 1s' }} />
              </div>
              <span style={{ fontSize: '12px', color: '#8B7355', textTransform: 'uppercase', letterSpacing: '0.12em', flexShrink: 0 }}>Mailbox</span>
            </div>
          </div>

          {/* Countdown */}
          <div>
            <p style={{ fontFamily: 'monospace', letterSpacing: '0.18em', fontSize: '11px', color: '#6B6256', textTransform: 'uppercase', marginBottom: '6px' }}>
              Arriving in
            </p>
            <p style={{ fontFamily: 'monospace', fontSize: '2.8rem', color: '#3E3831', letterSpacing: '0.05em', lineHeight: 1 }}>
              {countdown || formatRealCountdown(lid)}
            </p>
          </div>

          {/* Sealed */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.35 }}>
            <Lock style={{ width: '14px', height: '14px', color: '#8B7355' }} />
            <span style={{ fontSize: '13px', color: '#8B7355' }}>Sealed until arrival</span>
          </div>

          <p style={{ color: '#8B7355', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>
            Delivered with patience ✦ snail mail
          </p>
        </div>
      </div>
    );
  }

  // Letter view
  if (viewMode.mode === 'view' && viewMode.letterId) {
    if (letterLoading) {
      return (
        <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-[#3E3831] text-2xl mb-4">Loading your letter...</h2>
            <p className="text-[#6B6256] italic">📬</p>
          </div>
        </div>
      );
    }

    if (letterError) {
      return (
        <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
          <div className="max-w-md text-center bg-[#FEFDFB] border-2 border-[#D4CFC5] p-8">
            <h2 className="text-[#3E3831] text-2xl mb-4">Oops!</h2>
            <p className="text-[#6B6256] mb-4">{letterError}</p>
          </div>
        </div>
      );
    }

    if (!letter) {
      return (
        <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-[#6B6256]">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F7F4F0] p-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-[#3E3831] text-3xl mb-3">📬 snail mail</h1>
            <p className="text-[#6B6256] italic">You've got mail! 💌</p>
          </header>

          <div className="flex justify-center">
            <div className="w-full max-w-[500px] bg-[#FFF9F0] border-2 border-[#8B7355] p-8 shadow-lg">
              <div className="space-y-6">
                <div className="text-right text-sm text-[#6B6256] italic">
                  From {letter.location || 'somewhere special'}
                </div>

                <div className="text-[#3E3831] text-lg mb-4">
                  Dear {letter.recipientName},
                </div>

                <div className="text-[#3E3831] whitespace-pre-wrap leading-relaxed">
                  {letter.letterText || 'A special message just for you...'}
                </div>

                {letter.signature && (
                  <div className="mt-12 flex justify-end">
                    <img src={letter.signature} alt="Signature" className="h-20 w-auto" />
                  </div>
                )}

                <div className="mt-12 pt-6 border-t-2 border-dashed border-[#D4CFC5] text-center">
                  <p className="text-[#6B6256] mb-4 italic">
                    Want to send a letter back? 💌
                  </p>
                  <a
                    href="https://snail-mail-inky.vercel.app"
                    className="inline-block px-8 py-4 bg-[#8B7355] text-[#FEFDFB] border-2 border-[#8B7355] hover:bg-[#6B5335] transition-colors text-lg"
                    onClick={() => sessionStorage.removeItem('snailmail_route')}
                  >
                    Create Now!
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-sm text-[#8B7355] italic">
            Delivered with love 💕
          </div>
        </div>
      </div>
    );
  }

  // Sending screen
  if (senderView === 'sending') {
    return (
      <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
        <style>{psStarPulseStyle}</style>
        <StarBg />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <svg width="130" height="96" viewBox="0 0 130 96" fill="none">
            {/* Envelope body */}
            <rect x="5" y="18" width="96" height="64" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
            {/* Envelope flap V */}
            <path d="M5 18 L53 54 L101 18" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Letter tucked in */}
            <rect x="32" y="15" width="42" height="21" rx="1" fill="#FEFDFB" stroke="#A89478" strokeWidth="1.2"/>
            <line x1="38" y1="23" x2="68" y2="23" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="38" y1="28" x2="68" y2="28" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="38" y1="33" x2="60" y2="33" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            {/* Motion lines */}
            <line x1="110" y1="42" x2="124" y2="42" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
            <line x1="113" y1="52" x2="124" y2="52" stroke="#A89478" strokeWidth="1.2" strokeLinecap="round" opacity="0.45"/>
          </svg>

          <div className="flex flex-col items-center gap-3">
            <p style={{ fontFamily: 'monospace', letterSpacing: '0.22em', fontSize: '11px', color: '#6B6256', textTransform: 'uppercase' }}>
              Processing Through Digital Sorting Facility
            </p>
            <div className="flex items-center gap-2">
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B7355', display: 'inline-block', animation: 'psDot1 1.4s ease-in-out infinite' }}/>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B7355', display: 'inline-block', animation: 'psDot2 1.4s ease-in-out infinite' }}/>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#8B7355', display: 'inline-block', animation: 'psDot3 1.4s ease-in-out infinite' }}/>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success screen
  if (senderView === 'success') {
    return (
      <div className="fixed inset-0 bg-[#F7F4F0] flex flex-col items-center justify-center overflow-hidden">
        <style>{psStarPulseStyle}</style>
        <StarBg />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center px-8 max-w-md">
          {/* Envelope with teal checkmark circle */}
          <svg width="110" height="90" viewBox="0 0 110 90" fill="none">
            {/* Envelope body */}
            <rect x="5" y="24" width="80" height="56" rx="2" fill="#FAF6F0" stroke="#A89478" strokeWidth="1.5"/>
            {/* Envelope flap V */}
            <path d="M5 24 L45 54 L85 24" stroke="#A89478" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
            {/* Letter tucked in */}
            <rect x="26" y="17" width="38" height="21" rx="1" fill="#FEFDFB" stroke="#A89478" strokeWidth="1.2"/>
            <line x1="32" y1="25" x2="58" y2="25" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="32" y1="30" x2="58" y2="30" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            <line x1="32" y1="35" x2="50" y2="35" stroke="#C4BAB0" strokeWidth="1" strokeLinecap="round"/>
            {/* Teal checkmark circle — bottom right of envelope */}
            <circle cx="76" cy="68" r="14" fill="#5B9E8A"/>
            <path d="M69 68 L74 73.5 L83 62" stroke="#FEFDFB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <h2 style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2rem', color: '#3E3831', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            Mail Deposited Successfully!
          </h2>

          <p style={{ color: '#6B6256', fontSize: '15px', lineHeight: 1.65, margin: 0 }}>
            Your letter has been handed to the digital postmaster.
          </p>
          <p style={{ color: '#6B6256', fontSize: '14px', lineHeight: 1.65, margin: 0 }}>
            Your recipient will receive an email to track its journey — and another the moment it arrives.
          </p>

          <button
            onClick={() => { setSenderView('compose'); setSentLetterId(null); }}
            style={{ marginTop: '8px', padding: '15px 44px', background: '#1C1917', color: '#FEFDFB',
              border: 'none', letterSpacing: '0.18em', fontSize: '11px', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}
          >
            Write Another Letter
          </button>

          <p style={{ color: '#8B7355', fontSize: '12px', fontStyle: 'italic', marginTop: '2px' }}>
            Delivered with patience ✦ snail mail
          </p>
        </div>
      </div>
    );
  }

  // Create / compose mode
  return (
    <div className="min-h-screen bg-[#F7F4F0] p-8 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 30m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0' fill='%23000000'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-7xl mx-auto relative">
        <header className="text-center mb-12 relative">
          <div className="flex items-center justify-center gap-4 mb-3 relative">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="absolute -top-6 left-32 opacity-40">
              <path d="M9 2 L10 8 L9 14 M5 6 L9 9 L13 6 M13 12 L9 9 L5 12" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="absolute -top-4 right-40 opacity-30">
              <path d="M7 1 L8 7 L7 13 M3 4 L7 7 L11 4 M11 10 L7 7 L3 10" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute top-8 left-24 opacity-35">
              <path d="M8 1 L9 7 L8 13 M4 5 L8 8 L12 5 M12 11 L8 8 L4 11" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="absolute top-10 right-32 opacity-25">
              <path d="M6 1 L7 6 L6 11 M2 3 L6 6 L10 3 M10 9 L6 6 L2 9" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="absolute -top-2 left-64 opacity-30">
              <path d="M7.5 1 L8.5 7.5 L7.5 14 M3.5 4.5 L7.5 7.5 L11.5 4.5 M11.5 10.5 L7.5 7.5 L3.5 10.5" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="absolute top-6 right-56 opacity-28">
              <path d="M6.5 1 L7.5 6.5 L6.5 12 M2.5 4 L6.5 6.5 L10.5 4 M10.5 9 L6.5 6.5 L2.5 9" stroke="#8B7355" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            {/* Pencil sketch envelope */}
            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" className="transform -rotate-12">
              <defs>
                <filter id="pencil">
                  <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>
              <path d="M8 15 L8.2 14.9 L27 30 L27.2 30.1 L46 15 L46.2 14.8" stroke="#6B6256" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" filter="url(#pencil)"/>
              <path d="M8 15 L27 30 L46 15" stroke="#5A5248" strokeWidth="1.5" strokeLinecap="round" filter="url(#pencil)"/>
              <path d="M7.5 14.5 L7.5 39 L46.5 39 L46.5 14.5 L7.5 14.5" stroke="#6B6256" strokeWidth="1.3" strokeLinecap="round" opacity="0.7" filter="url(#pencil)"/>
              <path d="M8 15 L8 39 L46 39 L46 15 L8 15" stroke="#5A5248" strokeWidth="1.6" strokeLinecap="round" filter="url(#pencil)"/>
            </svg>

            <h1 className="text-[#3E3831] lowercase" style={{ fontFamily: '"Instrument Serif", serif', fontSize: '2.5rem', letterSpacing: '0.05em' }}>
              snail mail
            </h1>

            {/* Pencil sketch letter */}
            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" className="transform rotate-12">
              <defs>
                <filter id="pencil2">
                  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>
              <rect x="12" y="10" width="31" height="35" stroke="#6B6256" strokeWidth="1.2" fill="none" opacity="0.6" filter="url(#pencil2)"/>
              <rect x="12.2" y="10.2" width="30.6" height="34.6" stroke="#5A5248" strokeWidth="1.5" fill="#FFF9F0" filter="url(#pencil2)"/>
              <text x="16" y="18" fontFamily="serif" fontSize="4" fill="#8B7355" opacity="0.6" filter="url(#pencil2)">Dear...</text>
              <path d="M16 22 Q18 21.5 20 22 Q22 22.5 24 22 Q26 21.5 28 22 Q30 22.5 32 22 Q34 21.5 36 22 Q38 22.5 39 22" stroke="#8B7355" strokeWidth="0.7" fill="none" opacity="0.5" filter="url(#pencil2)"/>
              <path d="M16 25 Q18 24.5 20 25 Q22 25.5 24 25 Q26 24.5 28 25 Q30 25.5 32 25 Q34 24.5 36 25 Q38 25.5 39 25" stroke="#8B7355" strokeWidth="0.7" fill="none" opacity="0.5" filter="url(#pencil2)"/>
              <path d="M16 28 Q18 27.5 20 28 Q22 28.5 24 28 Q26 27.5 28 28 Q30 28.5 32 28 Q34 27.5 35 28" stroke="#8B7355" strokeWidth="0.7" fill="none" opacity="0.5" filter="url(#pencil2)"/>
              <path d="M16 31 Q18 30.5 20 31 Q22 31.5 24 31 Q26 30.5 28 31 Q30 31.5 32 31 Q34 30.5 36 31" stroke="#8B7355" strokeWidth="0.7" fill="none" opacity="0.4" filter="url(#pencil2)"/>
              <path d="M20 38 Q22 36 24 38 Q26 40 28 38 Q29 37 30 38" stroke="#8B7355" strokeWidth="0.9" fill="none" opacity="0.5" filter="url(#pencil2)"/>
              <circle cx="35" cy="38" r="3.5" stroke="#A85C4F" strokeWidth="1" fill="#A85C4F" opacity="0.3" filter="url(#pencil2)"/>
              <path d="M35 35 L35.5 37 L35 39 M32 36 L35 37.5 L38 36 M38 40 L35 38.5 L32 40" stroke="#8B7355" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" filter="url(#pencil2)"/>
            </svg>
          </div>
          <p className="text-[#6B6256] italic">Create the perfect personalized letter for someone special</p>
        </header>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start mb-8">
          <div className="sticky top-8">
            <CustomizationPanel
              paperTexture={paperTexture}
              setPaperTexture={setPaperTexture}
              envelopeStyle={envelopeStyle}
              setEnvelopeStyle={setEnvelopeStyle}
              location={location}
              setLocation={setLocation}
              decorations={decorations}
              setDecorations={setDecorations}
              recipientName={recipientName}
              setRecipientName={setRecipientName}
              letterText={letterText}
              setLetterText={setLetterText}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
            />
          </div>

          <div className="bg-[#FEFDFB] border-2 border-[#D4CFC5] p-8 shadow-[4px_4px_0px_0px_rgba(139,115,85,0.1)] min-h-[1200px] flex flex-col">
            <h2 className="text-center mb-6 text-[#3E3831] tracking-wide uppercase text-sm border-b-2 border-dashed border-[#D4CFC5] pb-2">Preview</h2>
            <div ref={previewRef} className="flex-1">
              <MailPreview
                paperTexture={paperTexture}
                envelopeStyle={envelopeStyle}
                location={location}
                recipientName={recipientName}
                letterText={letterText}
                signature={signature}
                setSignature={setSignature}
                uploadedImages={uploadedImages}
                setUploadedImages={setUploadedImages}
                setRecipientName={setRecipientName}
                setLetterText={setLetterText}
                decorations={decorations}
                setDecorations={setDecorations}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <ExportOptions
            onDownload={handleDownload}
            onPrint={handlePrint}
            onSendStart={() => setSenderView('sending')}
            onLetterSent={handleLetterSent}
            letterData={{
              recipientName,
              letterText,
              signature,
              paperTexture,
              envelopeStyle,
              location
            }}
          />
        </div>
      </div>
    </div>
  );
}
