import { Taste, Mood } from '@/types';
import { PREFERENCE_MATRIX, CONFIG } from '@/data/config';

export class PreferenceMatrix {
  private matrix: Record<string, Record<string, number>>;

  constructor() {
    this.matrix = PREFERENCE_MATRIX;
  }

  public calculateSatisfaction(taste: Taste, mood: Mood): number {
    const baseValue = this.matrix[taste]?.[mood] ?? 0;

    const clampedValue = Math.max(
      CONFIG.MIN_SATISFACTION_CHANGE,
      Math.min(CONFIG.MAX_SATISFACTION_CHANGE, baseValue)
    );

    return clampedValue;
  }

  public getPreference(taste: Taste, mood: Mood): number {
    return this.matrix[taste]?.[mood] ?? 0;
  }

  public setPreference(taste: Taste, mood: Mood, value: number): void {
    if (!this.matrix[taste]) {
      this.matrix[taste] = {};
    }
    this.matrix[taste][mood] = value;
  }

  public getAllPreferences(): Record<string, Record<string, number>> {
    return JSON.parse(JSON.stringify(this.matrix));
  }

  public getTastePreference(taste: Taste): Record<string, number> {
    return { ...this.matrix[taste] };
  }

  public getMoodPreference(mood: Mood): Record<string, number> {
    const result: Record<string, number> = {};
    for (const taste of Object.keys(this.matrix)) {
      result[taste] = this.matrix[taste][mood] ?? 0;
    }
    return result;
  }
}
