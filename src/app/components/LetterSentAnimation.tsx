import { motion } from 'motion/react';

interface LetterSentAnimationProps {
  recipientEmail: string;
  onClose: () => void;
}

export function LetterSentAnimation({ recipientEmail, onClose }: LetterSentAnimationProps) {

  // Generate random positions for stars
  const stars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 15 + Math.random() * 20,
    rotation: Math.random() * 360,
    delay: Math.random() * 0.5
  }));

  return (
    <div className="fixed inset-0 bg-[#F7F4F0] z-50 flex items-center justify-center overflow-hidden">
      {/* Sketchy stars scattered */}
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.4, 0.3],
            scale: [0, 1.2, 1],
            rotate: star.rotation
          }}
          transition={{
            duration: 1,
            delay: star.delay,
            ease: "easeOut"
          }}
        >
          <svg width={star.size} height={star.size} viewBox="0 0 40 40" fill="none">
            <defs>
              <filter id={`star-pencil-${star.id}`}>
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.8" xChannelSelector="R" yChannelSelector="G"/>
              </filter>
            </defs>
            <path
              d="M20 5 L21 18 L20 35 M10 12 L20 20 L30 12 M30 28 L20 20 L10 28"
              stroke="#8B7355"
              strokeWidth="2"
              strokeLinecap="round"
              filter={`url(#star-pencil-${star.id})`}
              opacity="0.6"
            />
          </svg>
        </motion.div>
      ))}

      {/* Flying letter envelope */}
      <motion.div
        className="relative z-10"
        initial={{ x: '-100vw', y: 0, rotate: -15 }}
        animate={{
          x: '100vw',
          y: [-20, 20, -10, 15, 0],
          rotate: [-15, -10, -20, -5, -15]
        }}
        transition={{
          x: { duration: 10, ease: "easeInOut" },
          y: { duration: 10, repeat: 0, ease: "easeInOut" },
          rotate: { duration: 10, ease: "easeInOut" }
        }}
      >
        <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
          <defs>
            <filter id="envelope-pencil">
              <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
            </filter>
          </defs>

          {/* Envelope body */}
          <rect
            x="20"
            y="30"
            width="160"
            height="100"
            fill="#F5E8D8"
            stroke="#8B7355"
            strokeWidth="3"
            filter="url(#envelope-pencil)"
          />

          {/* Envelope flap lines */}
          <path
            d="M20 30 L100 90 L180 30"
            stroke="#6B6256"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            filter="url(#envelope-pencil)"
          />
          <path
            d="M20 30 L100 85 L180 30"
            stroke="#8B7355"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
            filter="url(#envelope-pencil)"
          />

          {/* Stamp */}
          <rect
            x="140"
            y="45"
            width="30"
            height="35"
            fill="#E8D8C8"
            stroke="#8B7355"
            strokeWidth="2"
            filter="url(#envelope-pencil)"
          />
          <text
            x="155"
            y="68"
            fontSize="20"
            textAnchor="middle"
            filter="url(#envelope-pencil)"
          >
            💌
          </text>

          {/* Motion lines */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <line x1="5" y1="70" x2="15" y2="70" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
            <line x1="8" y1="85" x2="18" y2="85" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
            <line x1="3" y1="100" x2="13" y2="100" stroke="#8B7355" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
          </motion.g>
        </svg>
      </motion.div>

      {/* Success message */}
      <motion.div
        className="absolute inset-x-0 top-1/4 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2
          className="text-[#3E3831] mb-4"
          style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: '3rem',
            letterSpacing: '0.05em'
          }}
        >
          mail sent!
        </h2>
        <p className="text-[#6B6256] text-lg italic">
          Your notification is on its way to {recipientEmail}
        </p>
        <p className="text-[#8B7355] text-sm mt-2">
          (Don't forget to remind them to check spam! 📬)
        </p>
      </motion.div>

      {/* Return Home button */}
      <motion.button
        className="absolute bottom-12 left-1/2 -translate-x-1/2 px-8 py-4 border-2 border-[#8B7355] bg-[#8B7355] text-[#FEFDFB] hover:bg-[#6B5335] transition-colors text-lg"
        onClick={onClose}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          fontFamily: '"Instrument Serif", serif',
          letterSpacing: '0.05em'
        }}
      >
        Return Home
      </motion.button>
    </div>
  );
}
