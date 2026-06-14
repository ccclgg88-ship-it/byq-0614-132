import { create } from 'zustand';
import { GameEngine } from '@/game/GameEngine';
import { GameState, Food } from '@/types';

interface GameStore {
  engine: GameEngine | null;
  gameState: GameState | null;
  foods: Food[];
  isInitialized: boolean;
  initializeEngine: (canvas: HTMLCanvasElement) => void;
  destroyEngine: () => void;
  resetGame: () => void;
  getEngine: () => GameEngine | null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  engine: null,
  gameState: null,
  foods: [],
  isInitialized: false,

  initializeEngine: (canvas: HTMLCanvasElement) => {
    const engine = new GameEngine();
    engine.initialize(canvas);
    
    const foods = engine.getFoods();
    const initialState = engine.getState();
    
    set({ engine, foods, gameState: initialState, isInitialized: true });
    
    engine.subscribe(() => {
      set({ gameState: engine.getState() });
    });
  },

  destroyEngine: () => {
    const { engine } = get();
    if (engine) {
      engine.destroy();
      set({ engine: null, gameState: null, isInitialized: false });
    }
  },

  resetGame: () => {
    const { engine } = get();
    if (engine) {
      engine.reset();
    }
  },

  getEngine: () => get().engine,
}));
