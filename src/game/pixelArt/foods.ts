import { Taste } from '@/types';

export const createFoodPixelArt = (taste: Taste): number[][] => {
  const size = 16;
  const art: number[][] = [];
  
  for (let i = 0; i < size; i++) {
    art.push(Array(size).fill(0));
  }
  
  switch (taste) {
    case 'sweet':
      for (let y = 2; y < 14; y++) {
        for (let x = 2; x < 14; x++) {
          if (y === 2 || y === 13 || x === 2 || x === 13) {
            art[y][x] = 11;
          } else if (y < 6) {
            art[y][x] = 12;
          } else if (y < 9) {
            art[y][x] = 2;
          } else {
            art[y][x] = 14;
          }
        }
      }
      art[7][7] = 3;
      art[7][8] = 3;
      art[10][5] = 3;
      art[10][10] = 3;
      break;
      
    case 'salty':
      for (let y = 3; y < 13; y++) {
        for (let x = 3; x < 13; x++) {
          if (y === 3 || y === 12 || x === 3 || x === 12) {
            art[y][x] = 11;
          } else if ((x + y) % 3 === 0) {
            art[y][x] = 14;
          } else {
            art[y][x] = 5;
          }
        }
      }
      art[6][6] = 10;
      art[6][9] = 10;
      art[9][6] = 10;
      art[9][9] = 10;
      break;
      
    case 'spicy':
      for (let y = 2; y < 14; y++) {
        const startX = Math.max(2, 4 + (y - 2));
        const endX = Math.min(14, 12 - (y - 2));
        for (let x = startX; x < endX; x++) {
          if (x === startX || x === endX - 1 || y === 2 || y === 13) {
            art[y][x] = 11;
          } else if (y < 8) {
            art[y][x] = 7;
          } else {
            art[y][x] = 14;
          }
        }
      }
      art[4][7] = 14;
      art[4][8] = 14;
      art[12][7] = 10;
      break;
  }
  
  return art;
};

export const foodEmojis: Record<Taste, string> = {
  sweet: '🍰',
  salty: '🍟',
  spicy: '🌶️',
};

export const foodColors: Record<Taste, string> = {
  sweet: '#ffb6c1',
  salty: '#ffd700',
  spicy: '#ff4500',
};
