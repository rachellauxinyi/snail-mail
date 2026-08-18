interface LocationTheme {
  emoji: string;
  color: string;
  accentColor: string;
  keywords: string[];
  pattern: string;
  decorativeEmojis: string[];
  greeting: string;
}

const locations: Record<string, LocationTheme> = {
  paris: {
    emoji: '🗼',
    color: '#8B7355',
    accentColor: '#C9A88F',
    keywords: ['paris', 'france'],
    pattern: 'dots',
    decorativeEmojis: ['🥐', '🍷', '🎨', '🌹'],
    greeting: 'Bonjour from'
  },
  toronto: {
    emoji: '🗼',
    color: '#C9554F',
    accentColor: '#8B7355',
    keywords: ['toronto', 'canada'],
    pattern: 'maple',
    decorativeEmojis: ['🍁', '🏒', '❄️', '🏙️'],
    greeting: 'Greetings from'
  },
  newyork: {
    emoji: '🗽',
    color: '#5B7B9B',
    accentColor: '#E8C568',
    keywords: ['new york', 'nyc', 'manhattan'],
    pattern: 'skyline',
    decorativeEmojis: ['🍎', '🚕', '🏙️', '🗽'],
    greeting: 'Hello from'
  },
  london: {
    emoji: '🏰',
    color: '#A85C4F',
    accentColor: '#8B7355',
    keywords: ['london', 'england', 'uk'],
    pattern: 'union',
    decorativeEmojis: ['☕', '☂️', '🎩', '🎡'],
    greeting: 'Cheers from'
  },
  tokyo: {
    emoji: '🗾',
    color: '#E89BA8',
    accentColor: '#C9A88F',
    keywords: ['tokyo', 'japan'],
    pattern: 'sakura',
    decorativeEmojis: ['🌸', '🍱', '⛩️', '🗾'],
    greeting: 'こんにちは from'
  },
  sydney: {
    emoji: '🎭',
    color: '#5B9BD5',
    accentColor: '#E8C568',
    keywords: ['sydney', 'australia'],
    pattern: 'waves',
    decorativeEmojis: ['🦘', '🏄', '☀️', '🦎'],
    greeting: "G'day from"
  },
  dubai: {
    emoji: '🏙️',
    color: '#D4A85F',
    accentColor: '#8B7355',
    keywords: ['dubai', 'uae'],
    pattern: 'geometric',
    decorativeEmojis: ['🏜️', '🐪', '💎', '🌙'],
    greeting: 'Marhaba from'
  },
  cairo: {
    emoji: '🔺',
    color: '#D4A85F',
    accentColor: '#8B7355',
    keywords: ['cairo', 'egypt'],
    pattern: 'hieroglyphs',
    decorativeEmojis: ['🐫', '☀️', '🏺', '🔺'],
    greeting: 'Greetings from'
  },
  rome: {
    emoji: '🏛️',
    color: '#A8856F',
    accentColor: '#C9554F',
    keywords: ['rome', 'italy'],
    pattern: 'columns',
    decorativeEmojis: ['🍝', '🍷', '🏛️', '🛵'],
    greeting: 'Ciao from'
  },
  amsterdam: {
    emoji: '🚲',
    color: '#E89B68',
    accentColor: '#6B8E7F',
    keywords: ['amsterdam', 'netherlands'],
    pattern: 'tulips',
    decorativeEmojis: ['🌷', '🚲', '🧀', '🏘️'],
    greeting: 'Hallo from'
  },
  venice: {
    emoji: '🛶',
    color: '#5B9BD5',
    accentColor: '#A8856F',
    keywords: ['venice', 'venezia'],
    pattern: 'waves',
    decorativeEmojis: ['🛶', '🎭', '🌉', '🎪'],
    greeting: 'Ciao from'
  },
  sanfrancisco: {
    emoji: '🌉',
    color: '#C9554F',
    accentColor: '#5B9BD5',
    keywords: ['san francisco', 'sf', 'golden gate'],
    pattern: 'bridge',
    decorativeEmojis: ['🌁', '🚃', '🦭', '🌉'],
    greeting: 'Hello from'
  },
  losangeles: {
    emoji: '🎬',
    color: '#E8A568',
    accentColor: '#C9554F',
    keywords: ['los angeles', 'la', 'hollywood'],
    pattern: 'stars',
    decorativeEmojis: ['🌟', '🎥', '🌴', '🏖️'],
    greeting: 'Hello from'
  },
  seattle: {
    emoji: '☕',
    color: '#6B8E7F',
    accentColor: '#8B7355',
    keywords: ['seattle', 'washington'],
    pattern: 'coffee',
    decorativeEmojis: ['☕', '🌧️', '🎸', '🌲'],
    greeting: 'Greetings from'
  },
  lasvegas: {
    emoji: '🎰',
    color: '#E8A568',
    accentColor: '#C9554F',
    keywords: ['las vegas', 'vegas'],
    pattern: 'neon',
    decorativeEmojis: ['🎲', '🎰', '✨', '🌃'],
    greeting: 'Viva'
  },
  miami: {
    emoji: '🌴',
    color: '#5BC9BD',
    accentColor: '#E89B98',
    keywords: ['miami', 'florida'],
    pattern: 'palms',
    decorativeEmojis: ['🌴', '🏖️', '🍹', '🌊'],
    greeting: 'Hola from'
  },
  hawaii: {
    emoji: '🌺',
    color: '#E89B98',
    accentColor: '#6BC9A5',
    keywords: ['hawaii', 'honolulu'],
    pattern: 'floral',
    decorativeEmojis: ['🌺', '🏄', '🍍', '🌊'],
    greeting: 'Aloha from'
  },
  bali: {
    emoji: '🏝️',
    color: '#6BC9A5',
    accentColor: '#E89B68',
    keywords: ['bali', 'indonesia'],
    pattern: 'tropical',
    decorativeEmojis: ['🌴', '🛕', '🌺', '🐒'],
    greeting: 'Greetings from'
  },
  santorini: {
    emoji: '⛪',
    color: '#5B9BD5',
    accentColor: '#FFFFFF',
    keywords: ['santorini', 'greece'],
    pattern: 'waves',
    decorativeEmojis: ['🏖️', '🍋', '⛵', '🌅'],
    greeting: 'Γειά σου from'
  },
  reykjavik: {
    emoji: '❄️',
    color: '#5BC9E5',
    accentColor: '#9B8BD5',
    keywords: ['reykjavik', 'iceland'],
    pattern: 'snow',
    decorativeEmojis: ['❄️', '🌌', '♨️', '🐋'],
    greeting: 'Halló from'
  },
  barcelona: {
    emoji: '🏰',
    color: '#E89B68',
    accentColor: '#C9554F',
    keywords: ['barcelona', 'spain'],
    pattern: 'mosaic',
    decorativeEmojis: ['⚽', '🎨', '🥘', '🏟️'],
    greeting: 'Hola from'
  },
  chicago: {
    emoji: '🏙️',
    color: '#5B7B9B',
    accentColor: '#C9554F',
    keywords: ['chicago', 'illinois'],
    pattern: 'skyline',
    decorativeEmojis: ['🌭', '🎷', '🏀', '🌬️'],
    greeting: 'Hello from'
  },
  boston: {
    emoji: '⚓',
    color: '#A85C4F',
    accentColor: '#5B7B9B',
    keywords: ['boston', 'massachusetts'],
    pattern: 'harbor',
    decorativeEmojis: ['🦞', '⚾', '🍀', '🏛️'],
    greeting: 'Hello from'
  },
  nashville: {
    emoji: '🎸',
    color: '#E89B68',
    accentColor: '#8B7355',
    keywords: ['nashville', 'tennessee'],
    pattern: 'music',
    decorativeEmojis: ['🎵', '🎤', '🍗', '🎸'],
    greeting: 'Howdy from'
  },
  neworleans: {
    emoji: '🎺',
    color: '#9B6BA8',
    accentColor: '#E8C568',
    keywords: ['new orleans', 'nola', 'louisiana'],
    pattern: 'jazz',
    decorativeEmojis: ['🎭', '🎺', '⚜️', '🍋'],
    greeting: 'Hello from'
  },
  austin: {
    emoji: '🤠',
    color: '#C9554F',
    accentColor: '#E8A568',
    keywords: ['austin', 'texas'],
    pattern: 'western',
    decorativeEmojis: ['🎸', '🌮', '🦇', '🤠'],
    greeting: 'Howdy from'
  },
  portland: {
    emoji: '🌲',
    color: '#6B8E7F',
    accentColor: '#8B7355',
    keywords: ['portland', 'oregon'],
    pattern: 'forest',
    decorativeEmojis: ['☕', '🚲', '🌲', '🌧️'],
    greeting: 'Hello from'
  },
  denver: {
    emoji: '🏔️',
    color: '#7B8E7F',
    accentColor: '#5B9BD5',
    keywords: ['denver', 'colorado'],
    pattern: 'mountains',
    decorativeEmojis: ['⛷️', '🏔️', '☀️', '🎿'],
    greeting: 'Hello from'
  },
  philadelphia: {
    emoji: '🔔',
    color: '#A85C4F',
    accentColor: '#5B7B9B',
    keywords: ['philadelphia', 'philly', 'pennsylvania'],
    pattern: 'historic',
    decorativeEmojis: ['🦅', '🥨', '🏛️', '🔔'],
    greeting: 'Hello from'
  },
  washington: {
    emoji: '🏛️',
    color: '#5B7B9B',
    accentColor: '#C9554F',
    keywords: ['washington dc', 'dc', 'washington'],
    pattern: 'monument',
    decorativeEmojis: ['🦅', '🏛️', '🌸', '⚖️'],
    greeting: 'Greetings from'
  },
  montreal: {
    emoji: '⚜️',
    color: '#5B7B9B',
    accentColor: '#C9554F',
    keywords: ['montreal', 'quebec'],
    pattern: 'fleur',
    decorativeEmojis: ['🥖', '🎭', '⚜️', '🍁'],
    greeting: 'Bonjour from'
  },
  vancouver: {
    emoji: '🏔️',
    color: '#6B8E7F',
    accentColor: '#5B9BD5',
    keywords: ['vancouver', 'british columbia'],
    pattern: 'mountains',
    decorativeEmojis: ['🌲', '🏔️', '🍁', '🐻'],
    greeting: 'Hello from'
  },
  mexicocity: {
    emoji: '🌮',
    color: '#E89B68',
    accentColor: '#C9554F',
    keywords: ['mexico city', 'cdmx', 'mexico'],
    pattern: 'aztec',
    decorativeEmojis: ['🌮', '🌺', '🎨', '🌵'],
    greeting: 'Hola from'
  },
  havana: {
    emoji: '🚗',
    color: '#5BC9BD',
    accentColor: '#E89B68',
    keywords: ['havana', 'cuba'],
    pattern: 'vintage',
    decorativeEmojis: ['🎺', '🚗', '🌴', '🥃'],
    greeting: 'Hola from'
  },
  lisbon: {
    emoji: '🚃',
    color: '#E8C568',
    accentColor: '#5B9BD5',
    keywords: ['lisbon', 'portugal'],
    pattern: 'tiles',
    decorativeEmojis: ['🚃', '🥐', '🌊', '🐟'],
    greeting: 'Olá from'
  },
  madrid: {
    emoji: '🏛️',
    color: '#C9554F',
    accentColor: '#E8C568',
    keywords: ['madrid', 'spain'],
    pattern: 'royal',
    decorativeEmojis: ['⚽', '🍷', '🎨', '👑'],
    greeting: 'Hola from'
  },
  dublin: {
    emoji: '☘️',
    color: '#6B8E7F',
    accentColor: '#E89B68',
    keywords: ['dublin', 'ireland'],
    pattern: 'celtic',
    decorativeEmojis: ['☘️', '🍺', '🎻', '🏰'],
    greeting: 'Hello from'
  },
  edinburgh: {
    emoji: '🏰',
    color: '#7B8E7F',
    accentColor: '#9B6BA8',
    keywords: ['edinburgh', 'scotland'],
    pattern: 'tartan',
    decorativeEmojis: ['🏰', '🥃', '🎵', '🐉'],
    greeting: 'Hello from'
  },
  copenhagen: {
    emoji: '🚲',
    color: '#5B9BD5',
    accentColor: '#C9554F',
    keywords: ['copenhagen', 'denmark'],
    pattern: 'nordic',
    decorativeEmojis: ['🚲', '🧜‍♀️', '🥐', '🌷'],
    greeting: 'Hej from'
  },
  stockholm: {
    emoji: '🏰',
    color: '#5B9BD5',
    accentColor: '#E8C568',
    keywords: ['stockholm', 'sweden'],
    pattern: 'nordic',
    decorativeEmojis: ['⛵', '🏰', '☕', '🫐'],
    greeting: 'Hej from'
  },
  oslo: {
    emoji: '⛷️',
    color: '#5B9BD5',
    accentColor: '#7B8E7F',
    keywords: ['oslo', 'norway'],
    pattern: 'fjord',
    decorativeEmojis: ['⛷️', '🏔️', '🐟', '🌊'],
    greeting: 'Hei from'
  },
  helsinki: {
    emoji: '❄️',
    color: '#5BC9E5',
    accentColor: '#6B8E7F',
    keywords: ['helsinki', 'finland'],
    pattern: 'aurora',
    decorativeEmojis: ['❄️', '🌲', '☕', '🫐'],
    greeting: 'Hei from'
  },
  budapest: {
    emoji: '🏰',
    color: '#E89B68',
    accentColor: '#5B9BD5',
    keywords: ['budapest', 'hungary'],
    pattern: 'danube',
    decorativeEmojis: ['🏰', '♨️', '🎻', '🌊'],
    greeting: 'Szia from'
  },
  krakow: {
    emoji: '🏰',
    color: '#A85C4F',
    accentColor: '#E8C568',
    keywords: ['krakow', 'poland'],
    pattern: 'medieval',
    decorativeEmojis: ['🏰', '🥟', '🎨', '🍺'],
    greeting: 'Cześć from'
  },
  zurich: {
    emoji: '⛰️',
    color: '#C9554F',
    accentColor: '#6B8E7F',
    keywords: ['zurich', 'switzerland'],
    pattern: 'alpine',
    decorativeEmojis: ['⛰️', '🧀', '⌚', '🍫'],
    greeting: 'Grüezi from'
  },
  brussels: {
    emoji: '🍫',
    color: '#8B7355',
    accentColor: '#E8C568',
    keywords: ['brussels', 'belgium'],
    pattern: 'waffles',
    decorativeEmojis: ['🍫', '🧇', '🍺', '💐'],
    greeting: 'Bonjour from'
  },
  munich: {
    emoji: '🍺',
    color: '#5B9BD5',
    accentColor: '#E8C568',
    keywords: ['munich', 'germany'],
    pattern: 'bavarian',
    decorativeEmojis: ['🍺', '🥨', '⚽', '🎡'],
    greeting: 'Servus from'
  },
  milan: {
    emoji: '👗',
    color: '#9B7B6B',
    accentColor: '#C9554F',
    keywords: ['milan', 'italy'],
    pattern: 'fashion',
    decorativeEmojis: ['👗', '☕', '🎨', '💄'],
    greeting: 'Ciao from'
  },
  florence: {
    emoji: '🎨',
    color: '#A8856F',
    accentColor: '#C9554F',
    keywords: ['florence', 'italy'],
    pattern: 'renaissance',
    decorativeEmojis: ['🎨', '🍷', '🏛️', '🌺'],
    greeting: 'Ciao from'
  },
  naples: {
    emoji: '🍕',
    color: '#C9554F',
    accentColor: '#E8C568',
    keywords: ['naples', 'italy'],
    pattern: 'vesuvius',
    decorativeEmojis: ['🍕', '🌋', '🍋', '🧆'],
    greeting: 'Ciao from'
  },
  marrakesh: {
    emoji: '🕌',
    color: '#E89B68',
    accentColor: '#C9554F',
    keywords: ['marrakesh', 'marrakech', 'morocco'],
    pattern: 'moroccan',
    decorativeEmojis: ['🕌', '🐪', '🌴', '🏺'],
    greeting: 'Marhaba from'
  },
  capetown: {
    emoji: '🦁',
    color: '#7B8E7F',
    accentColor: '#E8C568',
    keywords: ['cape town', 'south africa'],
    pattern: 'safari',
    decorativeEmojis: ['🦁', '🏔️', '🌊', '🌿'],
    greeting: 'Hello from'
  },
  jerusalem: {
    emoji: '🕌',
    color: '#D4A85F',
    accentColor: '#5B9BD5',
    keywords: ['jerusalem', 'israel'],
    pattern: 'ancient',
    decorativeEmojis: ['🕌', '🕊️', '🏛️', '⭐'],
    greeting: 'Shalom from'
  },
  bangkok: {
    emoji: '🛕',
    color: '#E8A568',
    accentColor: '#C9554F',
    keywords: ['bangkok', 'thailand'],
    pattern: 'temple',
    decorativeEmojis: ['🛕', '🍜', '🐘', '🛺'],
    greeting: 'Sawasdee from'
  },
  hanoi: {
    emoji: '🏯',
    color: '#C9554F',
    accentColor: '#E8C568',
    keywords: ['hanoi', 'vietnam'],
    pattern: 'pagoda',
    decorativeEmojis: ['🏯', '🍜', '🏍️', '🌿'],
    greeting: 'Xin chào from'
  },
  seoul: {
    emoji: '🏯',
    color: '#E89BA8',
    accentColor: '#5B9BD5',
    keywords: ['seoul', 'korea', 'south korea'],
    pattern: 'hanbok',
    decorativeEmojis: ['🏯', '🍜', '💜', '🌸'],
    greeting: 'Annyeong from'
  },
  osaka: {
    emoji: '🏯',
    color: '#C9554F',
    accentColor: '#E8C568',
    keywords: ['osaka', 'japan'],
    pattern: 'castle',
    decorativeEmojis: ['🏯', '🍜', '🎌', '🐙'],
    greeting: 'Konnichiwa from'
  },
  kyoto: {
    emoji: '⛩️',
    color: '#C9554F',
    accentColor: '#E89BA8',
    keywords: ['kyoto', 'japan'],
    pattern: 'shrine',
    decorativeEmojis: ['⛩️', '🌸', '🍵', '🦊'],
    greeting: 'Konnichiwa from'
  },
  shanghai: {
    emoji: '🏙️',
    color: '#C9554F',
    accentColor: '#E8C568',
    keywords: ['shanghai', 'china'],
    pattern: 'skyline',
    decorativeEmojis: ['🏙️', '🥟', '🐉', '🏮'],
    greeting: 'Nǐ hǎo from'
  },
  mumbai: {
    emoji: '🛕',
    color: '#E89B68',
    accentColor: '#C9554F',
    keywords: ['mumbai', 'bombay', 'india'],
    pattern: 'bollywood',
    decorativeEmojis: ['🛕', '🎬', '🍛', '🌺'],
    greeting: 'Namaste from'
  },
  delhi: {
    emoji: '🕌',
    color: '#E89B68',
    accentColor: '#C9554F',
    keywords: ['delhi', 'new delhi', 'india'],
    pattern: 'mogul',
    decorativeEmojis: ['🕌', '🍛', '🐘', '🌶️'],
    greeting: 'Namaste from'
  },
  riodejaneiro: {
    emoji: '⛰️',
    color: '#6BC9A5',
    accentColor: '#E8C568',
    keywords: ['rio de janeiro', 'rio', 'brazil'],
    pattern: 'carnival',
    decorativeEmojis: ['⛰️', '⚽', '🎭', '🌴'],
    greeting: 'Olá from'
  },
  buenosaires: {
    emoji: '💃',
    color: '#C9554F',
    accentColor: '#5B7B9B',
    keywords: ['buenos aires', 'argentina'],
    pattern: 'tango',
    decorativeEmojis: ['💃', '🥩', '⚽', '🌹'],
    greeting: 'Hola from'
  },
  lima: {
    emoji: '🏔️',
    color: '#E89B68',
    accentColor: '#6B8E7F',
    keywords: ['lima', 'peru'],
    pattern: 'incan',
    decorativeEmojis: ['🏔️', '🦙', '🌶️', '🌽'],
    greeting: 'Hola from'
  },
  bogota: {
    emoji: '☕',
    color: '#8B7355',
    accentColor: '#6B8E7F',
    keywords: ['bogota', 'colombia'],
    pattern: 'coffee',
    decorativeEmojis: ['☕', '🌺', '🦜', '🎺'],
    greeting: 'Hola from'
  },
  auckland: {
    emoji: '🌋',
    color: '#6B8E7F',
    accentColor: '#5B9BD5',
    keywords: ['auckland', 'new zealand'],
    pattern: 'maori',
    decorativeEmojis: ['🌋', '🥝', '⛵', '🐑'],
    greeting: 'Kia ora from'
  },
  fiji: {
    emoji: '🏝️',
    color: '#5BC9BD',
    accentColor: '#E89BA8',
    keywords: ['fiji', 'suva'],
    pattern: 'tropical',
    decorativeEmojis: ['🏝️', '🌺', '🥥', '🐠'],
    greeting: 'Bula from'
  },
};

export function generateStampData(location: string) {
  const lowerLocation = location.toLowerCase().trim();

  // Try to find a matching location theme
  for (const [key, theme] of Object.entries(locations)) {
    if (theme.keywords.some(keyword => lowerLocation.includes(keyword))) {
      return {
        emoji: theme.emoji,
        color: theme.color,
        accentColor: theme.accentColor,
        pattern: theme.pattern,
        decorativeEmojis: theme.decorativeEmojis,
        greeting: theme.greeting,
        isLandmark: true
      };
    }
  }

  // Default fallback with hash-based color
  const hash = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = ['#A85C4F', '#6B8E7F', '#B89968', '#9B7B6B', '#8B7355', '#C9A88F'];
  const accentColors = ['#C9554F', '#8B9B7F', '#D4A85F', '#B8856F', '#A8856F', '#E8C9A8'];

  return {
    emoji: '📍',
    color: colors[hash % colors.length],
    accentColor: accentColors[hash % accentColors.length],
    pattern: 'default',
    decorativeEmojis: ['✈️', '🗺️', '📮'],
    greeting: 'Greetings from',
    isLandmark: false
  };
}
