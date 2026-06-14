import { ExpressionState } from '@/types';

export const createCharacterBase = (): number[][] => {
  const base: number[][] = [];
  
  for (let i = 0; i < 64; i++) {
    const row: number[] = [];
    for (let j = 0; j < 64; j++) {
      row.push(0);
    }
    base.push(row);
  }
  
  const headY = 8;
  const headX = 16;
  const headW = 32;
  const headH = 28;
  
  for (let y = headY; y < headY + headH; y++) {
    for (let x = headX; x < headX + headW; x++) {
      if (y === headY || y === headY + headH - 1 || x === headX || x === headX + headW - 1) {
        base[y][x] = 11;
      } else {
        base[y][x] = 12;
      }
    }
  }
  
  const hairY = 4;
  const hairH = 16;
  for (let y = hairY; y < hairY + hairH; y++) {
    for (let x = 12; x < 52; x++) {
      if (y < hairY + 4) {
        if (x >= 16 && x < 48) base[y][x] = 4;
      } else {
        if (x >= 14 && x < 50) base[y][x] = 4;
      }
    }
  }
  
  const sideHairX1 = 10;
  const sideHairX2 = 54;
  for (let y = 20; y < 44; y++) {
    for (let x = sideHairX1; x < sideHairX1 + 6; x++) {
      if (x < 52) base[y][x] = 4;
    }
    for (let x = sideHairX2 - 6; x < sideHairX2; x++) {
      if (x >= 12) base[y][x] = 4;
    }
  }
  
  const hornY = 2;
  const hornH = 8;
  for (let y = hornY; y < hornY + hornH; y++) {
    const w = hornH - (y - hornY);
    for (let x = 18; x < 18 + w; x++) {
      base[y][x] = 2;
    }
    for (let x = 46 - w; x < 46; x++) {
      base[y][x] = 2;
    }
  }
  
  const bodyY = 36;
  const bodyH = 24;
  for (let y = bodyY; y < bodyY + bodyH; y++) {
    for (let x = 18; x < 46; x++) {
      if (y === bodyY || y === bodyY + bodyH - 1 || x === 18 || x === 45) {
        base[y][x] = 1;
      } else {
        base[y][x] = 2;
      }
    }
  }
  
  const wingY = 38;
  const wingH = 16;
  for (let y = wingY; y < wingY + wingH; y++) {
    const wingW = 8 + Math.floor((y - wingY) / 2);
    for (let x = 6; x < 6 + wingW; x++) {
      base[y][x] = 5;
    }
    for (let x = 58 - wingW; x < 58; x++) {
      base[y][x] = 5;
    }
  }
  
  const tailY = 52;
  for (let y = tailY; y < 60; y++) {
    for (let x = 48; x < 56 + (y - tailY); x++) {
      if (x < 64) base[y][x] = 4;
    }
  }
  base[58][58] = 3;
  base[59][59] = 3;
  
  return base;
};

const createExpression = (
  eyeShape: number[][],
  mouthShape: number[][],
  blushLevel: 0 | 1 | 2 | 3 = 0,
  rightEyeShape?: number[][],
  browShape?: number[][],
  extraElements?: { y: number; x: number; pixels: number[][] }[]
): number[][] => {
  const expr: number[][] = [];
  for (let i = 0; i < 64; i++) {
    expr.push(Array(64).fill(0));
  }
  
  const leftEye = eyeShape;
  const rightEye = rightEyeShape || eyeShape;
  const eyeSizeY = leftEye.length;
  const eyeSizeX = leftEye[0]?.length || 0;
  
  const leftEyeY = 16;
  const leftEyeX = 20;
  const rightEyeX = 36;
  
  for (let y = 0; y < eyeSizeY; y++) {
    for (let x = 0; x < eyeSizeX; x++) {
      if (leftEye[y]?.[x] !== 0 && leftEye[y]?.[x] !== undefined) {
        expr[leftEyeY + y][leftEyeX + x] = leftEye[y][x];
      }
      if (rightEye[y]?.[x] !== 0 && rightEye[y]?.[x] !== undefined) {
        expr[leftEyeY + y][rightEyeX + x] = rightEye[y][x];
      }
    }
  }
  
  if (browShape) {
    const browSizeY = browShape.length;
    const browSizeX = browShape[0]?.length || 0;
    const browY = leftEyeY - browSizeY - 1;
    
    for (let y = 0; y < browSizeY; y++) {
      for (let x = 0; x < browSizeX; x++) {
        if (browShape[y]?.[x] !== 0 && browShape[y]?.[x] !== undefined) {
          expr[browY + y][leftEyeX + x] = browShape[y][x];
          expr[browY + y][rightEyeX + x] = browShape[y][x];
        }
      }
    }
  }
  
  const mouthSizeY = mouthShape.length;
  const mouthSizeX = mouthShape[0]?.length || 0;
  const mouthY = 30;
  const mouthX = 28 - Math.floor(mouthSizeX / 2) + 4;
  
  for (let y = 0; y < mouthSizeY; y++) {
    for (let x = 0; x < mouthSizeX; x++) {
      if (mouthShape[y]?.[x] !== 0 && mouthShape[y]?.[x] !== undefined) {
        expr[mouthY + y][mouthX + x] = mouthShape[y][x];
      }
    }
  }
  
  if (blushLevel >= 1) {
    const blushWidth = blushLevel === 1 ? 4 : blushLevel === 2 ? 6 : 8;
    const blushIntensity = blushLevel === 1 ? [12] : blushLevel === 2 ? [7, 12, 7] : [7, 7, 12, 7, 7];
    const blushY = leftEyeY + eyeSizeY + 2;
    
    for (let i = 0; i < blushWidth; i++) {
      const color = blushIntensity[Math.floor(i * blushIntensity.length / blushWidth)];
      expr[blushY][leftEyeX - 2 + i] = color;
      expr[blushY][rightEyeX - 2 + i] = color;
      if (blushLevel >= 2) {
        expr[blushY + 1][leftEyeX - 1 + i] = 12;
        expr[blushY + 1][rightEyeX - 1 + i] = 12;
      }
    }
  }
  
  if (extraElements) {
    for (const elem of extraElements) {
      for (let y = 0; y < elem.pixels.length; y++) {
        for (let x = 0; x < (elem.pixels[y]?.length || 0); x++) {
          if (elem.pixels[y]?.[x] !== 0 && elem.pixels[y]?.[x] !== undefined) {
            if (elem.y + y < 64 && elem.x + x < 64) {
              expr[elem.y + y][elem.x + x] = elem.pixels[y][x];
            }
          }
        }
      }
    }
  }
  
  return expr;
};

const eyeHappy = [
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [11, 11, 10, 10, 10, 10, 10, 10, 11, 11],
  [0, 11, 10, 10, 3, 3, 10, 10, 11, 0],
  [0, 11, 11, 10, 10, 10, 10, 11, 11, 0],
  [0, 0, 11, 11, 11, 11, 11, 11, 0, 0],
];

const eyeHappyWink = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const eyeShy = [
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [0, 0, 11, 11, 11, 11, 11, 11, 0, 0],
  [0, 0, 0, 11, 11, 11, 11, 0, 0, 0],
];

const eyeWronged = [
  [11, 11, 0, 0, 0, 0, 0, 0, 11, 11],
  [11, 10, 10, 10, 10, 10, 10, 10, 10, 11],
  [11, 10, 9, 10, 10, 10, 10, 9, 10, 11],
  [0, 11, 10, 10, 10, 10, 10, 10, 11, 0],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
];

const eyeSleepy = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [0, 0, 11, 11, 11, 11, 11, 11, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const eyeExcited = [
  [0, 3, 0, 11, 11, 11, 11, 0, 3, 0],
  [3, 3, 3, 11, 10, 10, 11, 3, 3, 3],
  [3, 10, 3, 11, 10, 10, 11, 3, 10, 3],
  [3, 3, 3, 11, 11, 11, 11, 3, 3, 3],
  [0, 3, 0, 0, 3, 3, 0, 0, 3, 0],
];

const browSad = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [11, 11, 0, 0, 0, 0, 0, 0, 11, 11],
  [11, 11, 11, 0, 0, 0, 0, 11, 11, 11],
];

const browHappy = [
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [11, 11, 0, 0, 0, 0, 0, 0, 11, 11],
];

const browExcited = [
  [3, 3, 0, 11, 11, 11, 11, 0, 3, 3],
  [0, 3, 3, 11, 11, 11, 11, 3, 3, 0],
];

const mouthHappy = [
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 11, 0],
  [11, 11, 7, 7, 7, 7, 7, 7, 7, 11, 11],
  [11, 7, 7, 10, 10, 10, 10, 10, 7, 7, 11],
  [0, 11, 7, 7, 10, 10, 10, 7, 7, 11, 0],
  [0, 0, 11, 11, 11, 11, 11, 11, 11, 0, 0],
];

const mouthShy = [
  [0, 0, 0, 11, 11, 11, 11, 11, 0, 0, 0],
  [0, 0, 11, 12, 12, 12, 12, 12, 11, 0, 0],
  [0, 11, 12, 12, 7, 7, 7, 12, 12, 11, 0],
  [0, 0, 11, 12, 12, 12, 12, 12, 11, 0, 0],
  [0, 0, 0, 11, 11, 11, 11, 11, 0, 0, 0],
];

const mouthCoquettish = [
  [0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0],
  [11, 7, 7, 7, 11, 11, 0, 0, 0, 0, 0],
  [11, 7, 7, 7, 7, 11, 0, 0, 0, 0, 0],
  [11, 7, 7, 7, 11, 0, 0, 0, 0, 0, 0],
  [0, 11, 11, 11, 0, 0, 0, 0, 0, 0, 0],
];

const mouthWronged = [
  [0, 0, 11, 11, 11, 11, 11, 11, 0, 0, 0],
  [0, 11, 12, 12, 12, 12, 12, 12, 11, 0, 0],
  [11, 12, 12, 7, 7, 7, 7, 12, 12, 11, 0],
  [11, 12, 7, 7, 9, 9, 7, 7, 12, 11, 0],
  [0, 11, 11, 11, 11, 11, 11, 11, 11, 0, 0],
];

const mouthSleepy = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 11, 11, 11, 11, 0, 0, 0, 0],
  [0, 0, 11, 12, 12, 12, 12, 11, 0, 0, 0],
  [0, 0, 0, 11, 12, 12, 11, 0, 0, 0, 0],
  [0, 0, 0, 0, 11, 11, 0, 0, 0, 0, 0],
];

const mouthExcited = [
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  [11, 7, 7, 7, 10, 10, 10, 7, 7, 7, 11],
  [11, 7, 10, 10, 10, 3, 10, 10, 10, 7, 11],
  [11, 7, 7, 10, 3, 3, 3, 10, 7, 7, 11],
  [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
];

const tears = [
  {
    y: 23,
    x: 20,
    pixels: [
      [9, 9],
      [9, 9],
      [0, 9],
      [9, 0],
      [0, 9],
    ],
  },
  {
    y: 23,
    x: 46,
    pixels: [
      [9, 9],
      [9, 9],
      [9, 0],
      [0, 9],
      [9, 0],
    ],
  },
];

const sparkles = [
  {
    y: 10,
    x: 15,
    pixels: [
      [0, 0, 3, 0, 0],
      [0, 3, 3, 3, 0],
      [3, 3, 10, 3, 3],
      [0, 3, 3, 3, 0],
      [0, 0, 3, 0, 0],
    ],
  },
  {
    y: 8,
    x: 45,
    pixels: [
      [0, 3, 0],
      [3, 10, 3],
      [0, 3, 0],
    ],
  },
  {
    y: 14,
    x: 8,
    pixels: [
      [3, 0, 3],
      [0, 3, 0],
      [3, 0, 3],
    ],
  },
];

const heartBubbles = [
  {
    y: 8,
    x: 10,
    pixels: [
      [2, 0, 2],
      [2, 2, 2],
      [2, 2, 2],
      [0, 2, 0],
    ],
  },
  {
    y: 12,
    x: 52,
    pixels: [
      [2, 0, 2],
      [2, 2, 2],
      [0, 2, 0],
    ],
  },
];

export const characterExpressions: Record<ExpressionState, number[][]> = {
  happy: createExpression(
    eyeHappy,
    mouthHappy,
    2,
    undefined,
    browHappy
  ),
  shy: createExpression(
    eyeShy,
    mouthShy,
    3,
    undefined,
    undefined,
    heartBubbles
  ),
  coquettish: createExpression(
    eyeHappy,
    mouthCoquettish,
    3,
    eyeHappyWink,
    browHappy,
    heartBubbles
  ),
  wronged: createExpression(
    eyeWronged,
    mouthWronged,
    2,
    undefined,
    browSad,
    tears
  ),
  sleepy: createExpression(
    eyeSleepy,
    mouthSleepy,
    1,
    undefined,
    browSad
  ),
  excited: createExpression(
    eyeExcited,
    mouthExcited,
    3,
    undefined,
    browExcited,
    sparkles
  ),
};
