import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

interface LetterViewProps {
  letterId: string;
}

export function LetterView({ letterId }: LetterViewProps) {
  const [letter, setLetter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-4ba6ddf6/letter/${letterId}`,
          {
            headers: {
              'Authorization': `Bearer ${publicAnonKey}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || 'Failed to load letter');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setLetter(data.letter);
        setLoading(false);
      } catch (err) {
        setError('Failed to load letter');
        setLoading(false);
      }
    };

    fetchLetter();
  }, [letterId]);

  const getTextureStyle = (texture: string) => {
    switch (texture) {
      case 'cream':
        return 'bg-[#FFF9F0]';
      case 'aged':
        return 'bg-[#F5F0E8]';
      case 'parchment':
        return 'bg-[#F2EDE3]';
      case 'kraft':
        return 'bg-[#E8DCC8]';
      default:
        return 'bg-[#FFF9F0]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-[#3E3831] text-2xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Loading your letter...
          </h2>
          <p className="text-[#6B6256] italic">📬</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F4F0] flex items-center justify-center p-8">
        <div className="max-w-md text-center bg-[#FEFDFB] border-2 border-[#D4CFC5] p-8">
          <h2 className="text-[#3E3831] text-2xl mb-4" style={{ fontFamily: '"Instrument Serif", serif' }}>
            Oops!
          </h2>
          <p className="text-[#6B6256] mb-4">{error}</p>
          <p className="text-[#8B7355] text-sm italic">
            {error.includes('not yet delivered')
              ? "This letter hasn't arrived yet. Check back in a few days!"
              : "This letter may have been lost in the mail."}
          </p>
        </div>
      </div>
    );
  }

  if (!letter) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F4F0] p-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 30m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0' fill='%23000000'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }} />

      <div className="max-w-4xl mx-auto relative">
        <header className="text-center mb-12">
          <h1 className="text-[#3E3831] lowercase mb-3" style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: '2.5rem',
            letterSpacing: '0.05em'
          }}>
            📬 snail mail
          </h1>
          <p className="text-[#6B6256] italic">You've got mail! 💌</p>
        </header>

        <div className="flex justify-center">
          <div
            className={`w-full max-w-[500px] shadow-2xl ${getTextureStyle(letter.paperTexture)} border-2 p-8 relative`}
            style={{ borderColor: '#8B735540' }}
          >
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%238B7355' fill-opacity='0.05'%3E%3Cpath d='M0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`
            }} />

            <div className="space-y-6 relative">
              <div className="text-right text-sm text-[#6B6256] italic">
                From {letter.location || 'somewhere special'}
              </div>

              <div className="text-[#3E3831] font-serif text-lg mb-4">
                Dear {letter.recipientName},
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
                <p className="text-[#6B6256] mb-4 italic">
                  Want to send a letter back? 💌
                </p>
                <a
                  href="https://venue-sienna-69575773.figma.site"
                  className="inline-block px-8 py-4 bg-[#8B7355] text-[#FEFDFB] border-2 border-[#8B7355] hover:bg-[#6B5335] transition-colors text-lg"
                  style={{
                    fontFamily: '"Instrument Serif", serif',
                    letterSpacing: '0.05em'
                  }}
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
