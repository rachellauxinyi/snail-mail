import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';
import { Sparkles, Upload, X } from 'lucide-react';
import { generateStampData } from './StampGenerator';
import { CITY_NAMES } from '../data/cities';

function CityAutocomplete({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const suggestions = value.length > 0
    ? CITY_NAMES.filter(c => norm(c).includes(norm(value))).slice(0, 8)
    : [];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] placeholder:text-[#6B6256]/50 focus:border-[#8B7355] focus:outline-none transition-colors"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 left-0 right-0 top-full border border-[#D4CFC5] bg-[#FEFDFB] shadow-sm">
          {suggestions.map(city => (
            <div
              key={city}
              className="px-3 py-2 text-sm text-[#3E3831] hover:bg-[#F7F4F0] cursor-pointer"
              onMouseDown={(e) => { e.preventDefault(); onChange(city); setOpen(false); }}
            >
              {city}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface CustomizationPanelProps {
  paperTexture: string;
  setPaperTexture: (texture: string) => void;
  envelopeStyle: string;
  setEnvelopeStyle: (style: string) => void;
  location: string;
  setLocation: (location: string) => void;
  fromCity: string;
  setFromCity: (v: string) => void;
  toCity: string;
  setToCity: (v: string) => void;
  selectedStampEmoji: string | null;
  setSelectedStampEmoji: (emoji: string | null) => void;
  recipientName: string;
  setRecipientName: (name: string) => void;
  letterText: string;
  setLetterText: (text: string) => void;
  uploadedImages: Array<{
    id: string;
    url: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>;
  setUploadedImages: (images: Array<{
    id: string;
    url: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>) => void;
  decorations: Array<{
    id: string;
    type: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>;
  setDecorations: (decorations: Array<{
    id: string;
    type: string;
    width: number;
    height: number;
    x: number;
    y: number;
    rotation: number;
  }>) => void;
}

function CityRequestModal({ onClose }: { onClose: () => void }) {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!city.trim()) return;
    setSending(true);
    try {
      await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-4ba6ddf6/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientEmail: 'rachellauxinyi@gmail.com',
          recipientName: 'Rachel',
          letterData: {
            recipientName: 'Rachel',
            letterText: `City request from snail mail 🐌\n\nCity: ${city}\nCountry: ${country}`,
            signature: null,
            paperTexture: 'cream',
            envelopeStyle: 'classic',
            location: city,
            recipientEmail: 'rachellauxinyi@gmail.com',
          },
        }),
      });
    } catch (_) {
      // silently fall through — still show success
    }
    setSending(false);
    setSent(true);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={sent ? onClose : undefined}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative bg-[#FEFDFB] border-2 border-[#D4CFC5] p-6 max-w-sm w-full shadow-[4px_4px_0px_0px_rgba(139,115,85,0.15)]"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-[#B8A99A] hover:text-[#8B7355] transition-colors">
          <X className="w-4 h-4" />
        </button>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">✨</div>
            <p className="text-[#3E3831] mb-2" style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.2rem' }}>
              Request sent!
            </p>
            <p className="text-[#6B6256] text-xs leading-relaxed">
              Sit tight — we'll add <span className="text-[#8B7355] font-medium">{city}</span> and let you know within <span className="text-[#8B7355] font-medium">24 hours</span>. 🐌
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full px-4 py-2.5 border-2 border-[#D4CFC5] text-[#6B6256] text-sm hover:bg-[#F7F4F0] transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <p className="text-[#3E3831] mb-1" style={{ fontFamily: '"Instrument Serif", serif', fontSize: '1.1rem' }}>
              Request a City
            </p>
            <p className="text-[#6B6256] text-xs mb-4 leading-relaxed">
              We'll review your request and add it within <span className="text-[#8B7355] font-medium">24 hours</span>.
            </p>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="e.g. Okinawa"
                  className="w-full px-3 py-2 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] placeholder:text-[#6B6256]/40 focus:border-[#8B7355] focus:outline-none transition-colors text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  placeholder="e.g. Japan"
                  className="w-full px-3 py-2 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] placeholder:text-[#6B6256]/40 focus:border-[#8B7355] focus:outline-none transition-colors text-sm"
                />
              </div>
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !city.trim()}
              className="w-full px-4 py-2.5 border-2 border-[#8B7355] bg-[#8B7355] text-[#FEFDFB] text-sm hover:bg-[#6B5335] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : 'Send Request →'}
            </button>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export function CustomizationPanel({
  paperTexture,
  setPaperTexture,
  envelopeStyle,
  setEnvelopeStyle,
  location,
  setLocation,
  fromCity,
  setFromCity,
  toCity,
  setToCity,
  selectedStampEmoji,
  setSelectedStampEmoji,
  decorations,
  setDecorations,
  recipientName,
  setRecipientName,
  letterText,
  setLetterText,
  uploadedImages,
  setUploadedImages
}: CustomizationPanelProps) {
  const [showCityModal, setShowCityModal] = useState(false);
  const stampData = generateStampData(toCity || location);
  const stampEmojis = [stampData.emoji, ...stampData.decorativeEmojis].slice(0, 5);

  const getDecorationIcon = (type: string) => {
    const color = '#8B7355';
    const size = 20;

    switch (type) {
      case 'stickers':
      case 'stars':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="inline-block">
            <defs>
              <filter id={`icon-pencil-${type}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <path d="M20 5 L21 18 L20 35 M10 12 L20 20 L30 12 M30 28 L20 20 L10 28"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  filter={`url(#icon-pencil-${type})`}
                  opacity="0.7"/>
          </svg>
        );
      case 'hearts':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="inline-block">
            <defs>
              <filter id="icon-pencil-heart">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <path d="M20 32 C12 26 8 20 8 14 C8 8 12 6 15 6 C17 6 19 8 20 10 C21 8 23 6 25 6 C28 6 32 8 32 14 C32 20 28 26 20 32 Z"
                  stroke="#A85C4F"
                  strokeWidth="2"
                  fill="#A85C4F"
                  fillOpacity="0.2"
                  strokeLinecap="round"
                  filter="url(#icon-pencil-heart)"/>
          </svg>
        );
      case 'flowers':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="inline-block">
            <defs>
              <filter id="icon-pencil-flower">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <circle cx="20" cy="15" r="4" stroke="#D4A5A5" strokeWidth="2" fill="#D4A5A5" fillOpacity="0.3" filter="url(#icon-pencil-flower)"/>
            <circle cx="26" cy="20" r="4" stroke="#D4A5A5" strokeWidth="2" fill="#D4A5A5" fillOpacity="0.3" filter="url(#icon-pencil-flower)"/>
            <circle cx="20" cy="25" r="4" stroke="#D4A5A5" strokeWidth="2" fill="#D4A5A5" fillOpacity="0.3" filter="url(#icon-pencil-flower)"/>
            <circle cx="14" cy="20" r="4" stroke="#D4A5A5" strokeWidth="2" fill="#D4A5A5" fillOpacity="0.3" filter="url(#icon-pencil-flower)"/>
            <circle cx="20" cy="20" r="3" stroke="#B89968" strokeWidth="1.5" fill="#B89968" fillOpacity="0.4" filter="url(#icon-pencil-flower)"/>
          </svg>
        );
      case 'ribbon':
        return (
          <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className="inline-block">
            <defs>
              <filter id="icon-pencil-ribbon">
                <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.9" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            {/* Bow loops */}
            <ellipse cx="14" cy="15" rx="6" ry="8" stroke="#A85C4F" strokeWidth="2" fill="#A85C4F" fillOpacity="0.2" filter="url(#icon-pencil-ribbon)"/>
            <ellipse cx="26" cy="15" rx="6" ry="8" stroke="#A85C4F" strokeWidth="2" fill="#A85C4F" fillOpacity="0.2" filter="url(#icon-pencil-ribbon)"/>
            {/* Center knot */}
            <circle cx="20" cy="15" r="4" stroke="#A85C4F" strokeWidth="2" fill="#A85C4F" fillOpacity="0.4" filter="url(#icon-pencil-ribbon)"/>
            {/* Ribbon tails */}
            <path d="M18 19 L15 32 L17 30" stroke="#A85C4F" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#icon-pencil-ribbon)"/>
            <path d="M22 19 L25 32 L23 30" stroke="#A85C4F" strokeWidth="2" strokeLinecap="round" fill="none" filter="url(#icon-pencil-ribbon)"/>
          </svg>
        );
      case 'washi-tape':
        return (
          <svg width={size} height={size} viewBox="0 0 40 20" fill="none" className="inline-block">
            <defs>
              <filter id="icon-pencil-tape">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <rect width="40" height="20" fill="#B89968" fillOpacity="0.3" filter="url(#icon-pencil-tape)"/>
            <line x1="0" y1="2" x2="40" y2="2" stroke="#8B7355" strokeWidth="1" strokeDasharray="4,2" opacity="0.4" filter="url(#icon-pencil-tape)"/>
            <line x1="0" y1="18" x2="40" y2="18" stroke="#8B7355" strokeWidth="1" strokeDasharray="4,2" opacity="0.4" filter="url(#icon-pencil-tape)"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const newImage = {
          id: Date.now().toString() + Math.random().toString(),
          url,
          width: 100,
          height: 100,
          x: 50,
          y: 50,
          rotation: 0
        };
        setUploadedImages([...uploadedImages, newImage]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const addDecoration = (type: string) => {
    const newDecoration = {
      id: Date.now().toString() + Math.random().toString(),
      type,
      width: type === 'washi-tape' ? 80 : 40,
      height: type === 'washi-tape' ? 20 : 40,
      x: Math.random() * 100 + 50,
      y: Math.random() * 100 + 50,
      rotation: 0
    };
    setDecorations([...decorations, newDecoration]);
  };

  const removeDecoration = (id: string) => {
    setDecorations(decorations.filter(dec => dec.id !== id));
  };

  return (
    <>
    {showCityModal && <CityRequestModal onClose={() => setShowCityModal(false)} />}
    <div className="bg-[#FEFDFB] border-2 border-[#D4CFC5] p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(139,115,85,0.1)] h-full">
      <div className="flex items-center gap-2 pb-4 border-b-2 border-dashed border-[#D4CFC5]">
        <Sparkles className="w-5 h-5 text-[#8B7355]" />
        <h2 className="text-[#3E3831] tracking-wide uppercase text-sm">Customize Your Mail</h2>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-3">
          <h3 className="text-[#3E3831] text-sm tracking-wide font-semibold">Delivery Route</h3>
          <button
            onClick={() => setShowCityModal(true)}
            className="text-[10px] text-[#B8A99A] hover:text-[#8B7355] transition-colors"
          >
            Can't find your city? Request it →
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1">From (City, Country)</label>
            <CityAutocomplete
              value={fromCity}
              onChange={setFromCity}
              placeholder="e.g. Toronto, Canada"
            />
          </div>
          <div>
            <label className="block text-xs text-[#8B7355] uppercase tracking-widest mb-1">To (City, Country)</label>
            <CityAutocomplete
              value={toCity}
              onChange={setToCity}
              placeholder="e.g. London, UK"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide">
          Paper Texture
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'cream', label: 'Cream', color: '#FFF9F0' },
            { id: 'aged', label: 'Aged', color: '#F5F0E8' },
            { id: 'parchment', label: 'Parchment', color: '#F2EDE3' },
            { id: 'kraft', label: 'Kraft', color: '#E8DCC8' }
          ].map(texture => (
            <button
              key={texture.id}
              onClick={() => setPaperTexture(texture.id)}
              className={`p-3 border-2 transition-all ${
                paperTexture === texture.id
                  ? 'border-[#8B7355] shadow-[2px_2px_0px_0px_rgba(139,115,85,0.3)]'
                  : 'border-[#D4CFC5] hover:border-[#8B7355]'
              }`}
              style={{ backgroundColor: texture.color }}
            >
              <div className="text-sm text-[#3E3831]">{texture.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide">Envelope Style</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'classic', label: 'Classic', colors: ['#F5F0E8', '#E8DCC8'] },
            { id: 'vintage', label: 'Vintage', colors: ['#E8DCC8', '#D4C4A8'] },
            { id: 'rustic', label: 'Rustic', colors: ['#D4C4A8', '#C4B498'] },
            { id: 'antique', label: 'Antique', colors: ['#E0D5C5', '#D0C5B5'] }
          ].map(env => (
            <button
              key={env.id}
              onClick={() => setEnvelopeStyle(env.id)}
              className={`p-3 border-2 transition-all ${
                envelopeStyle === env.id
                  ? 'border-[#8B7355] shadow-[2px_2px_0px_0px_rgba(139,115,85,0.3)]'
                  : 'border-[#D4CFC5] hover:border-[#8B7355]'
              }`}
              style={{
                background: `linear-gradient(to bottom right, ${env.colors[0]}, ${env.colors[1]})`
              }}
            >
              <div className="text-sm text-[#3E3831]">{env.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide font-semibold">Stamp</h3>
        {toCity ? (
          <div className="space-y-3">
            <p className="text-xs text-[#6B6256]">
              Pick an emoji for your <span className="text-[#8B7355] font-medium">{toCity.split(',')[0]}</span> stamp:
            </p>
            <div className="flex gap-2 flex-wrap">
              {stampEmojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setSelectedStampEmoji(emoji === stampData.emoji && !selectedStampEmoji ? null : emoji)}
                  className={`w-12 h-12 text-2xl flex items-center justify-center border-2 transition-colors ${
                    (selectedStampEmoji === emoji) || (!selectedStampEmoji && emoji === stampData.emoji)
                      ? 'border-[#8B7355] bg-[#F7F4F0]'
                      : 'border-[#D4CFC5] bg-[#FEFDFB] hover:bg-[#F7F4F0]'
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <button
                onClick={() => setSelectedStampEmoji('none')}
                className={`w-12 h-12 flex flex-col items-center justify-center border-2 transition-colors gap-0.5 ${
                  selectedStampEmoji === 'none'
                    ? 'border-[#8B7355] bg-[#F7F4F0]'
                    : 'border-[#D4CFC5] bg-[#FEFDFB] hover:bg-[#F7F4F0]'
                }`}
              >
                <span className="text-base leading-none">🚫</span>
                <span className="text-[9px] text-[#B8A99A] leading-none">none</span>
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#6B6256]/60 italic">
            Enter a recipient city above to customise the stamp.
          </p>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide">Add Decorations</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'stickers', label: 'Stickers' },
            { id: 'washi-tape', label: 'Washi Tape' },
            { id: 'ribbon', label: 'Ribbon' },
            { id: 'hearts', label: 'Hearts' },
            { id: 'stars', label: 'Stars' },
            { id: 'flowers', label: 'Flowers' }
          ].map(dec => (
            <button
              key={dec.id}
              onClick={() => addDecoration(dec.id)}
              className="px-3 py-2 border-2 transition-all bg-[#FEFDFB] border-[#D4CFC5] text-[#3E3831] hover:border-[#8B7355] hover:bg-[#F7F4F0] flex items-center gap-2"
            >
              {getDecorationIcon(dec.id)}
              <span className="text-sm">{dec.label}</span>
            </button>
          ))}
        </div>

        {decorations.length > 0 && (
          <div className="mt-3 space-y-2">
            {decorations.map(decoration => (
              <div key={decoration.id} className="flex items-center gap-2 p-2 border border-[#D4CFC5] bg-[#FEFDFB]">
                <div className="flex items-center justify-center w-6 h-6">
                  {getDecorationIcon(decoration.type)}
                </div>
                <div className="flex-1 text-xs text-[#6B6256] capitalize">
                  {decoration.type}
                </div>
                <button
                  onClick={() => removeDecoration(decoration.id)}
                  className="p-1 hover:bg-[#D4CFC5] transition-colors"
                >
                  <X className="w-4 h-4 text-[#A85C4F]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide">Upload Images</h3>
        <label className="w-full px-4 py-3 border-2 border-dashed border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] hover:border-[#8B7355] transition-colors cursor-pointer flex items-center justify-center gap-2">
          <Upload className="w-5 h-5" />
          <span>Choose images to upload</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>

        {uploadedImages.length > 0 && (
          <div className="mt-3 space-y-2">
            {uploadedImages.map(image => (
              <div key={image.id} className="flex items-center gap-2 p-2 border border-[#D4CFC5] bg-[#FEFDFB]">
                <img src={image.url} alt="Uploaded" className="w-12 h-12 object-cover" />
                <div className="flex-1 text-xs text-[#6B6256]">
                  {image.width}x{image.height}px
                </div>
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-1 hover:bg-[#D4CFC5] transition-colors"
                >
                  <X className="w-4 h-4 text-[#A85C4F]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
