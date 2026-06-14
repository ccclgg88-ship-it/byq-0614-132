import { ExpressionState } from '@/types';
import linesData from '@/data/lines.json';

type LineCategory = ExpressionState | 'feed_generic' | 'refuse' | 'cooldown';

export class LineSystem {
  private lines: Record<string, string[]>;
  private lastUsedLines: Record<string, number> = {};

  constructor() {
    this.lines = linesData as Record<string, string[]>;
  }

  public getLine(category: LineCategory): string {
    const lines = this.lines[category] || this.lines.feed_generic;
    if (!lines || lines.length === 0) {
      return '...';
    }

    let index = this.lastUsedLines[category] ?? -1;
    let attempts = 0;
    do {
      index = Math.floor(Math.random() * lines.length);
      attempts++;
    } while (index === this.lastUsedLines[category] && lines.length > 1 && attempts < 5);

    this.lastUsedLines[category] = index;
    return lines[index];
  }

  public getExpressionLine(expression: ExpressionState): string {
    return this.getLine(expression);
  }

  public getFeedLine(satisfaction: number): string {
    if (satisfaction >= 20) {
      return this.getLine('happy');
    } else if (satisfaction >= 0) {
      return this.getLine('feed_generic');
    } else {
      return this.getLine('wronged');
    }
  }

  public getRefuseLine(): string {
    return this.getLine('refuse');
  }

  public getCooldownLine(): string {
    return this.getLine('cooldown');
  }

  public getAllLines(category: LineCategory): string[] {
    return [...(this.lines[category] || [])];
  }

  public addLine(category: LineCategory, line: string): void {
    if (!this.lines[category]) {
      this.lines[category] = [];
    }
    this.lines[category].push(line);
  }

  public getCategories(): string[] {
    return Object.keys(this.lines);
  }
}
