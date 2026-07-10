import { useState } from 'react';
import { Download, Printer, Mail, Check } from 'lucide-react';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { LetterSentAnimation } from './LetterSentAnimation';

const CITY_COORDS: Record<string, [number, number]> = {
  'toronto': [43.65, -79.38], 'london': [51.51, -0.13], 'paris': [48.85, 2.35],
  'new york': [40.71, -74.01], 'los angeles': [34.05, -118.24], 'tokyo': [35.68, 139.69],
  'sydney': [-33.87, 151.21], 'berlin': [52.52, 13.41], 'rome': [41.90, 12.50],
  'madrid': [40.42, -3.70], 'amsterdam': [52.37, 4.90], 'dubai': [25.20, 55.27],
  'singapore': [1.35, 103.82], 'hong kong': [22.32, 114.17], 'seoul': [37.57, 126.98],
  'beijing': [39.91, 116.39], 'mumbai': [19.08, 72.88], 'cairo': [30.04, 31.24],
  'mexico city': [19.43, -99.13], 'buenos aires': [-34.60, -58.38], 'cape town': [-33.93, 18.42],
  'chicago': [41.88, -87.63], 'san francisco': [37.77, -122.42], 'seattle': [47.61, -122.33],
  'boston': [42.36, -71.06], 'miami': [25.77, -80.19], 'vancouver': [49.28, -123.12],
  'montreal': [45.51, -73.57], 'edinburgh': [55.95, -3.19], 'barcelona': [41.39, 2.15],
  'lisbon': [38.72, -9.14], 'vienna': [48.21, 16.37], 'prague': [50.08, 14.44],
  'stockholm': [59.33, 18.07], 'oslo': [59.91, 10.75], 'copenhagen': [55.68, 12.57],
  'zurich': [47.38, 8.54], 'brussels': [50.85, 4.35], 'athens': [37.98, 23.73],
  'istanbul': [41.01, 28.95], 'bangkok': [13.75, 100.52], 'jakarta': [-6.21, 106.85],
  'manila': [14.60, 120.98], 'nairobi': [-1.29, 36.82], 'lagos': [6.52, 3.38],
};

function estimateDelivery(from: string, to: string): string {
  const extract = (s: string) => s.toLowerCase().split(',')[0].trim();
  const a = CITY_COORDS[extract(from)];
  const b = CITY_COORDS[extract(to)];
  if (!a || !b) return '';
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLon = (b[1] - a[1]) * Math.PI / 180;
  const h = Math.sin(dLat/2)**2 + Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2;
  const km = 2 * R * Math.asin(Math.sqrt(h));
  const hours = Math.round(km / 50); // ~50km/h effective postal speed
  const days = Math.floor(hours / 24);
  const rem = hours % 24;
  return days > 0 ? `~${days} day${days !== 1 ? 's' : ''}${rem > 0 ? ` ${rem}h` : ''}` : `~${rem}h`;
}

interface ExportOptionsProps {
  onDownload: () => void;
  onPrint: () => void;
  onSendStart?: () => void;
  onLetterSent?: (letterId: string) => void;
  fromCity?: string;
  toCity?: string;
  letterData: {
    recipientName: string;
    letterText: string;
    signature: string | null;
    paperTexture: string;
    envelopeStyle: string;
    location: string;
  };
}

export function ExportOptions({ onDownload, onPrint, onSendStart, onLetterSent, fromCity, toCity, letterData }: ExportOptionsProps) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const handleSendEmail = async () => {
    if (!recipientEmail || !recipientEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    onSendStart?.();

    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4ba6ddf6/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail,
          recipientName: letterData.recipientName,
          letterData: {
            ...letterData,
            recipientEmail
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Error sending email:', errorData);
        alert(`Failed to send email: ${errorData.error || 'Unknown error'}`);
        setIsSending(false);
        return;
      }

      const result = await response.json();
      console.log('Email sent successfully:', result);

      setIsSending(false);
      if (result.letterId) onLetterSent?.(result.letterId);
      setShowAnimation(true);
    } catch (error) {
      console.log('Network error while sending email:', error);
      alert('Failed to send email. Please check your connection and try again.');
      setIsSending(false);
    }
  };

  return (
    <>
      {showAnimation && (
        <LetterSentAnimation
          recipientEmail={recipientEmail}
          onClose={() => {
            setShowAnimation(false);
            setRecipientEmail('');
            setSent(false);
          }}
        />
      )}

      <div className="bg-[#FEFDFB] border-2 border-[#D4CFC5] p-8 shadow-[4px_4px_0px_0px_rgba(139,115,85,0.1)]">
      <h3 className="text-[#3E3831] text-center tracking-wide uppercase mb-6 pb-3 border-b-2 border-dashed border-[#D4CFC5]" style={{
        fontFamily: '"Instrument Serif", serif',
        fontSize: '1.5rem',
        letterSpacing: '0.1em'
      }}>
        Send Your Mail
      </h3>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-[2fr_1fr] gap-6 items-start">
          <div className="space-y-4">
            {fromCity && toCity && (
              <div className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-[#D4CFC5] bg-[#F7F4F0] text-sm text-[#6B6256]">
                <span>{fromCity} → {toCity}</span>
                {estimateDelivery(fromCity, toCity) && (
                  <span className="text-[#8B7355]">Est. delivery: {estimateDelivery(fromCity, toCity)}</span>
                )}
              </div>
            )}
            <div>
              <label className="block text-sm text-[#6B6256] mb-2">
                Recipient's Email Address
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="friend@example.com"
                className="w-full px-4 py-3 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] placeholder:text-[#6B6256]/50 focus:border-[#8B7355] focus:outline-none transition-colors"
                disabled={sent}
              />
            </div>

            <button
              onClick={handleSendEmail}
              disabled={isSending || sent}
              className={`w-full px-6 py-4 border-2 transition-colors flex items-center justify-center gap-2 text-lg ${
                sent
                  ? 'border-[#6B8E7F] bg-[#6B8E7F] text-[#FEFDFB]'
                  : 'border-[#8B7355] bg-[#8B7355] text-[#FEFDFB] hover:bg-[#6B5335]'
              }`}
            >
              {sent ? (
                <>
                  <Check className="w-5 h-5" />
                  Mail Sent!
                </>
              ) : isSending ? (
                'Sending...'
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  Send Mail Notification
                </>
              )}
            </button>

            {sent && (
              <div className="p-4 bg-[#E8E3DC] border-2 border-[#6B8E7F] text-sm text-[#3E3831] text-center">
                📬 Your recipient will be notified that mail is on the way!<br/>
                <span className="font-medium">Average delivery: 3 days</span><br/>
                <span className="text-xs mt-2 block opacity-75">💡 Ask them to check their spam folder if they don't see it</span>
              </div>
            )}

            <p className="text-sm text-[#6B6256] italic text-center pt-2">
              We'll send them an email letting them know something special is on the way! 💌<br/>
              <span className="text-xs opacity-75">(The email might land in spam, so let them know to check!)</span>
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-[#6B6256] uppercase tracking-wider mb-3">Save Options</p>
            <button
              onClick={onDownload}
              className="w-full px-4 py-3 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] hover:bg-[#F7F4F0] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={onPrint}
              className="w-full px-4 py-3 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] hover:bg-[#F7F4F0] transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            <p className="text-xs text-[#6B6256] italic pt-2">
              💡 Download and print to send real snail mail! 📮
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
