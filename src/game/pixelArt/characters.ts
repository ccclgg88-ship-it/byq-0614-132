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
  blush: boolean = false
): number[][] => {
  const expr: number[][] = [];
  for (let i = 0; i < 64; i++) {
    expr.push(Array(64).fill(0));
  }
  
  for (let y = 0; y < eyeShape.length; y++) {
    for (let x = 0; x < eyeShape[y].length; x++) {
      if (eyeShape[y][x] !== 0) {
        expr[18 + y][22 + x] = eyeShape[y][x];
        expr[18 + y][38 + x] = eyeShape[y][x];
      }
    }
  }
  
  for (let y = 0; y < mouthShape.length; y++) {
    for (let x = 0; x < mouthShape[y].length; x++) {
      if (mouthShape[y][x] !== 0) {
        expr[28 + y][28 + x] = mouthShape[y][x];
      }
    }
  }
  
  if (blush) {
    for (let x = 0; x < 6; x++) {
      expr[24][18 + x] = 12;
      expr[24][19 + x] = 7;
      expr[24][40 + x] = 12;
      expr[24][41 + x] = 7;
    }
  }
  
  return expr;
};

const eyeHappy = [
  [0, 11, 11, 11, 11, 0],
  [11, 10, 10, 10, 10, 11],
  [0, 11, 11, 11, 11, 0],
];

const eyeShy = [
  [11, 11, 0, 0, 11, 11],
  [0, 11, 11, 11, 11, 0],
  [0, 0, 11, 11, 0, 0],
];

const eyeCoquettish = [
  [0, 11, 11, 11, 11, 0],
  [11, 10, 11, 11, 10, 11],
  [0, 11, 0, 0, 11, 0],
];

const eyeWronged = [
  [11, 0, 0, 0, 0, 11],
  [11, 10, 10, 10, 10, 11],
  [0, 11, 11, 11, 11, 0],
];

const eyeSleepy = [
  [0, 0, 0, 0, 0, 0],
  [11, 11, 11, 11, 11, 11],
  [0, 0, 0, 0, 0, 0],
];

const eyeExcited = [
  [11, 11, 11, 11, 11, 11],
  [11, 3, 10, 10, 3, 11],
  [11, 11, 11, 11, 11, 11],
];

const mouthHappy = [
  [0, 11, 0, 0, 11, 0, 0, 0],
  [11, 7, 11, 11, 7, 11, 0, 0],
  [0, 11, 7, 7, 11, 0, 0, 0],
];

const mouthShy = [
  [0, 0, 11, 11, 11, 11, 0, 0],
  [0, 11, 12, 12, 12, 12, 11, 0],
  [0, 0, 11, 11, 11, 11, 0, 0],
];

const mouthCoquettish = [
  [0, 11, 11, 0, 0, 0, 0, 0],
  [11, 2, 2, 11, 0, 0, 0, 0],
  [0, 11, 11, 0, 0, 0, 0, 0],
];

const mouthWronged = [
  [0, 11, 11, 11, 11, 0, 0, 0],
  [11, 12, 12, 12, 12, 11, 0, 9],
  [0, 11, 11, 11, 11, 0, 9, 0],
];

const mouthSleepy = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 11, 11, 11, 11, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const mouthExcited = [
  [0, 11, 11, 11, 11, 11, 11, 0],
  [11, 7, 7, 10, 10, 7, 7, 11],
  [0, 11, 11, 11, 11, 11, 11, 0],
];

export const characterExpressions: Record<ExpressionState, number[][]> = {
  happy: createExpression(eyeHappy, mouthHappy, false),
  shy: createExpression(eyeShy, mouthShy, true),
  coquettish: createExpression(eyeCoquettish, mouthCoquettish, true),
  wronged: createExpression(eyeWronged, mouthWronged, false),
  sleepy: createExpression(eyeSleepy, mouthSleepy, false),
  excited: createExpression(eyeExcited, mouthExcited, false),
};
