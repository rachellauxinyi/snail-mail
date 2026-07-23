import { useState, useRef, useEffect } from 'react';
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
  decorations,
  setDecorations,
  recipientName,
  setRecipientName,
  letterText,
  setLetterText,
  uploadedImages,
  setUploadedImages
}: CustomizationPanelProps) {
  const stampData = generateStampData(location);

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
    <div className="bg-[#FEFDFB] border-2 border-[#D4CFC5] p-6 space-y-6 shadow-[4px_4px_0px_0px_rgba(139,115,85,0.1)]">
      <div className="flex items-center gap-2 pb-4 border-b-2 border-dashed border-[#D4CFC5]">
        <Sparkles className="w-5 h-5 text-[#8B7355]" />
        <h2 className="text-[#3E3831] tracking-wide uppercase text-sm">Customize Your Mail</h2>
      </div>

      <div>
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide font-semibold">Delivery Route</h3>
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
        <h3 className="mb-3 text-[#3E3831] text-sm tracking-wide">Stamp Location</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter a location..."
            className="w-full px-4 py-3 border-2 border-[#D4CFC5] bg-[#FEFDFB] text-[#3E3831] placeholder:text-[#6B6256]/50 focus:border-[#8B7355] focus:outline-none transition-colors"
          />

          {/* Stamp Preview */}
          <div className="flex items-center gap-3 p-3 border-2 border-[#D4CFC5] bg-gradient-to-br from-[#F5E8D8] to-[#E8D8C8]">
            <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-[#F5E8D8] to-[#E8D8C8] border-2 border-[#FEFDFB] shadow-sm relative">
              {/* Mini perforations */}
              <div className="absolute top-0 left-0 right-0 h-[2px] flex justify-between px-[1px]">
                {[...Array(6)].map((_, i) => (
                  <div key={`preview-top-${i}`} className="w-[2px] h-[2px] rounded-full bg-[#FEFDFB]" />
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[2px] flex justify-between px-[1px]">
                {[...Array(6)].map((_, i) => (
                  <div key={`preview-bottom-${i}`} className="w-[2px] h-[2px] rounded-full bg-[#FEFDFB]" />
                ))}
              </div>

              <div className="border border-[#8B7355]/20 h-full flex flex-col items-center justify-center p-1 gap-0.5">
                <div className="text-xl">
                  {stampData.emoji}
                </div>
                <div className="text-[6px] text-[#3E3831] tracking-wide uppercase text-center line-clamp-2 px-1 leading-tight break-words w-full">
                  {location}
                </div>
                <div className="text-[5px] text-[#3E3831]/60">55¢</div>
              </div>
            </div>

            <div className="flex-1 text-xs text-[#6B6256]">
              Your stamp will feature <span className="font-medium text-[#3E3831]">{location}</span>
            </div>
          </div>
        </div>
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
  );
}
