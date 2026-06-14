import { Food, Position, DragState } from '@/types';

export class DragSystem {
  private dragState: DragState;
  private canvas: HTMLCanvasElement;
  private onDrop?: (food: Food, position: Position) => void;
  private onDragStart?: (food: Food) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.dragState = {
      isDragging: false,
      currentFood: null,
      position: { x: 0, y: 0 },
    };
  }

  public startDrag(food: Food, clientX: number, clientY: number): void {
    this.dragState.isDragging = true;
    this.dragState.currentFood = food;
    this.updatePosition(clientX, clientY);
    
    if (this.onDragStart) {
      this.onDragStart(food);
    }
  }

  public updatePosition(clientX: number, clientY: number): void {
    const rect = this.canvas.getBoundingClientRect();
    this.dragState.position = {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  public endDrag(position: Position): void {
    if (this.dragState.isDragging && this.dragState.currentFood) {
      if (this.onDrop) {
        this.onDrop(this.dragState.currentFood, position);
      }
    }
    this.cancelDrag();
  }

  public cancelDrag(): void {
    this.dragState.isDragging = false;
    this.dragState.currentFood = null;
  }

  public getState(): DragState {
    return { ...this.dragState };
  }

  public isDragging(): boolean {
    return this.dragState.isDragging;
  }

  public getDragPosition(): Position | null {
    return this.dragState.isDragging ? { ...this.dragState.position } : null;
  }

  public getDragFood(): Food | null {
    return this.dragState.currentFood;
  }

  public setOnDrop(callback: (food: Food, position: Position) => void): void {
    this.onDrop = callback;
  }

  public setOnDragStart(callback: (food: Food) => void): void {
    this.onDragStart = callback;
  }

  public getCanvasPosition(clientX: number, clientY: number): Position {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }
}
