export const CONFIG = {
  CANVAS_WIDTH: 640,
  CANVAS_HEIGHT: 480,
  PIXEL_SCALE: 2,
  FULLNESS_DECAY_RATE: 2,
  FULLNESS_PER_FEED: 10,
  MIN_SATISFACTION_CHANGE: -20,
  MAX_SATISFACTION_CHANGE: 30,
  EXPRESSION_MIN_DURATION: 2000,
  FEED_COOLDOWN: 3000,
  HITBOX_RADIUS: 80,
  MAX_FULLNESS: 100,
  MIN_FULLNESS: 0,
  MAX_SATISFACTION: 100,
  MIN_SATISFACTION: -100,
  CHARACTER_X: 320,
  CHARACTER_Y: 240,
  CHEWING_DURATION: 1500,
  REFUSE_DURATION: 1000,
  SPEECH_BUBBLE_DURATION: 3000,
  MOOD_CHANGE_INTERVAL: 30000,
  FOOD_SIZE: 48,
  TRAY_HEIGHT: 100,
} as const;

export const FOODS = [
  { id: 'cake', name: '蛋糕', taste: 'sweet' as const, color: '#ffb6c1', emoji: '🍰' },
  { id: 'candy', name: '糖果', taste: 'sweet' as const, color: '#ff69b4', emoji: '🍬' },
  { id: 'chocolate', name: '巧克力', taste: 'sweet' as const, color: '#8b4513', emoji: '🍫' },
  { id: 'chips', name: '薯片', taste: 'salty' as const, color: '#ffd700', emoji: '🍟' },
  { id: 'popcorn', name: '爆米花', taste: 'salty' as const, color: '#fffacd', emoji: '🍿' },
  { id: 'pepper', name: '辣椒', taste: 'spicy' as const, color: '#ff4500', emoji: '🌶️' },
  { id: 'spicy_snack', name: '辣条', taste: 'spicy' as const, color: '#dc143c', emoji: '🥓' },
];

export const PREFERENCE_MATRIX: Record<string, Record<string, number>> = {
  sweet: { normal: 15, good: 25, bad: 5 },
  salty: { normal: 10, good: 15, bad: -10 },
  spicy: { normal: -15, good: -5, bad: -20 },
};

export const EXPRESSION_NAMES: Record<string, string> = {
  happy: '开心',
  shy: '害羞',
  coquettish: '撒娇',
  wronged: '委屈',
  sleepy: '困倦',
  excited: '兴奋',
};

export const MOOD_NAMES: Record<string, string> = {
  normal: '普通',
  good: '好心情',
  bad: '坏心情',
};

export const PIXEL_COLORS: Record<number, string> = {
  0: 'transparent',
  1: '#2d1b4e',
  2: '#ff6b9d',
  3: '#ffd93d',
  4: '#9b59b6',
  5: '#f5e6ff',
  6: '#1a0f2e',
  7: '#e74c3c',
  8: '#2ecc71',
  9: '#3498db',
  10: '#ffffff',
  11: '#000000',
  12: '#ffb6c1',
  13: '#8b4513',
  14: '#ffa500',
};
