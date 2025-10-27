const adjectives = [
  'wise', 'quick', 'bright', 'calm', 'bold', 'cool', 'warm', 'soft', 'hard', 'fast',
  'slow', 'big', 'small', 'tall', 'short', 'wide', 'thin', 'thick', 'light', 'dark',
  'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white',
  'silver', 'golden', 'bronze', 'crystal', 'diamond', 'ruby', 'emerald', 'sapphire',
  'ancient', 'modern', 'classic', 'vintage', 'fresh', 'old', 'new', 'young', 'mature',
  'wild', 'tame', 'free', 'bound', 'open', 'closed', 'clear', 'cloudy', 'sunny', 'stormy'
];

const nouns = [
  'fox', 'wolf', 'bear', 'lion', 'tiger', 'eagle', 'hawk', 'owl', 'dove', 'swan',
  'whale', 'shark', 'dolphin', 'turtle', 'rabbit', 'deer', 'horse', 'cat', 'dog', 'bird',
  'tree', 'flower', 'leaf', 'branch', 'root', 'seed', 'fruit', 'berry', 'grass', 'moss',
  'rock', 'stone', 'crystal', 'gem', 'pearl', 'shell', 'coral', 'sand', 'wave', 'tide',
  'mountain', 'hill', 'valley', 'river', 'lake', 'ocean', 'sea', 'pond', 'stream', 'creek',
  'cloud', 'star', 'moon', 'sun', 'comet', 'meteor', 'galaxy', 'planet', 'cosmos', 'void',
  'fire', 'flame', 'spark', 'ember', 'ash', 'smoke', 'mist', 'fog', 'rain', 'snow',
  'wind', 'breeze', 'storm', 'thunder', 'lightning', 'rainbow', 'aurora', 'dawn', 'dusk', 'night'
];

/**
 * Generates a readable URL slug in the format: adjective-noun-number
 * Example: wise-fox-82, quick-ocean-99, purple-comet-37
 */
export function generateReadableId(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100); // 0-99

  return `${adjective}-${noun}-${number}`;
}

/**
 * Validates if a string matches the readable ID format
 */
export function isValidReadableId(id: string): boolean {
  const pattern = /^[a-z]+-[a-z]+-\d{1,2}$/;
  return pattern.test(id);
}