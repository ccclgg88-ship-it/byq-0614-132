import { CONFIG, PIXEL_COLORS } from '@/data/config';
import { ExpressionState, GameState, Position, Food } from '@/types';
import { createCharacterBase, characterExpressions } from './pixelArt/characters';
import { createFoodPixelArt } from './pixelArt/foods';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private characterBase: number[][];
  private characterX: number;
  private characterY: number;
  private floatOffset: number = 0;
  private chewFrame: number = 0;
  private refuseAngle: number = 0;
  private pixelScale: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.characterBase = createCharacterBase();
    this.characterX = CONFIG.CHARACTER_X;
    this.characterY = CONFIG.CHARACTER_Y;
    this.pixelScale = CONFIG.PIXEL_SCALE;
    
    this.ctx.imageSmoothingEnabled = false;
  }

  public render(
    state: GameState,
    isDragging: boolean,
    dragPosition: Position | null,
    dragFood: Food | null,
    deltaTime: number
  ): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.renderBackground();
    
    if (state.showHitbox || isDragging) {
      this.renderHitbox();
    }
    
    if (state.animationState === 'refusing') {
      this.refuseAngle = Math.sin(Date.now() / 50) * 5;
    } else {
      this.refuseAngle *= 0.9;
    }
    
    if (state.animationState === 'chewing') {
      this.chewFrame = (this.chewFrame + deltaTime * 10) % 1;
    } else {
      this.chewFrame *= 0.9;
    }
    
    this.floatOffset = Math.sin(Date.now() / 500) * 4;
    
    this.ctx.save();
    this.ctx.translate(this.characterX, this.characterY + this.floatOffset);
    this.ctx.rotate((this.refuseAngle * Math.PI) / 180);
    
    this.renderCharacter(state.currentExpression);
    
    if (state.animationState === 'chewing' && dragFood) {
      this.renderChewingFood(dragFood);
    }
    
    this.ctx.restore();
    
    if (isDragging && dragPosition && dragFood) {
      this.renderDraggingFood(dragFood, dragPosition);
    }
    
    this.renderScanlines();
  }

  private renderBackground(): void {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#1a0f2e');
    gradient.addColorStop(1, '#2d1b4e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = '#3d2b5e';
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 30; x++) {
        if ((x + y) % 2 === 0) {
          this.ctx.fillRect(x * 32, y * 32, 32, 32);
        }
      }
    }
    
    this.ctx.fillStyle = '#4a3568';
    this.ctx.fillRect(0, this.canvas.height - 100, this.canvas.width, 100);
    
    this.ctx.fillStyle = '#3d2b5e';
    for (let x = 0; x < this.canvas.width; x += 32) {
      this.ctx.fillRect(x, this.canvas.height - 100, 16, 8);
    }
  }

  private renderHitbox(): void {
    this.ctx.strokeStyle = 'rgba(255, 107, 157, 0.5)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.arc(this.characterX, this.characterY, CONFIG.HITBOX_RADIUS, 0, Math.PI * 2);
    this.ctx.stroke();
    this.ctx.setLineDash([]);
    
    this.ctx.fillStyle = 'rgba(255, 107, 157, 0.1)';
    this.ctx.beginPath();
    this.ctx.arc(this.characterX, this.characterY, CONFIG.HITBOX_RADIUS, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private renderCharacter(expression: ExpressionState): void {
    const baseData = this.characterBase;
    const exprData = characterExpressions[expression];
    
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const baseColor = baseData[y][x];
        const exprColor = exprData[y][x];
        const colorIndex = exprColor !== 0 ? exprColor : baseColor;
        
        if (colorIndex !== 0) {
          const color = PIXEL_COLORS[colorIndex] || '#ffffff';
          const offsetY = y >= 28 && y < 32 ? Math.sin(this.chewFrame * Math.PI * 2) * 2 : 0;
          
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            (x - 32) * this.pixelScale,
            (y - 32 + offsetY) * this.pixelScale,
            this.pixelScale,
            this.pixelScale
          );
        }
      }
    }
  }

  private renderChewingFood(food: Food): void {
    const foodArt = createFoodPixelArt(food.taste);
    const scale = this.pixelScale;
    const progress = this.chewFrame;
    const yOffset = -60 + progress * 40;
    const scaleDown = 1 - progress * 0.5;
    
    this.ctx.save();
    this.ctx.translate(0, yOffset);
    this.ctx.scale(scaleDown, scaleDown);
    
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const colorIndex = foodArt[y][x];
        if (colorIndex !== 0) {
          const color = PIXEL_COLORS[colorIndex] || '#ffffff';
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            (x - 8) * scale,
            (y - 8) * scale,
            scale,
            scale
          );
        }
      }
    }
    
    this.ctx.restore();
  }

  private renderDraggingFood(food: Food, position: Position): void {
    const foodArt = createFoodPixelArt(food.taste);
    const scale = this.pixelScale * 1.5;
    
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    this.ctx.globalAlpha = 0.8;
    
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const colorIndex = foodArt[y][x];
        if (colorIndex !== 0) {
          const color = PIXEL_COLORS[colorIndex] || '#ffffff';
          this.ctx.fillStyle = color;
          this.ctx.fillRect(
            (x - 8) * scale,
            (y - 8) * scale,
            scale,
            scale
          );
        }
      }
    }
    
    this.ctx.restore();
  }

  private renderScanlines(): void {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    for (let y = 0; y < this.canvas.height; y += 4) {
      this.ctx.fillRect(0, y, this.canvas.width, 2);
    }
  }

  public resize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.imageSmoothingEnabled = false;
  }

  public isInHitbox(position: Position): boolean {
    const dx = position.x - this.characterX;
    const dy = position.y - this.characterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= CONFIG.HITBOX_RADIUS;
  }

  public setPixelScale(scale: number): void {
    this.pixelScale = scale;
  }
}
