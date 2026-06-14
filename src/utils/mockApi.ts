export interface IntimacyReportRequest {
  date: string;
  totalSatisfaction: number;
  feedCount: number;
}

export interface IntimacyReportResponse {
  success: boolean;
  message: string;
  currentIntimacy: number;
}

export async function reportIntimacy(
  data: IntimacyReportRequest
): Promise<IntimacyReportResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseIntimacy = data.totalSatisfaction * 0.1;
      const feedBonus = data.feedCount * 0.5;
      const currentIntimacy = Math.max(0, baseIntimacy + feedBonus);

      resolve({
        success: true,
        message: '亲密度上报成功',
        currentIntimacy: Math.round(currentIntimacy * 100) / 100,
      });
    }, 300);
  });
}

export interface FeedHistoryEntry {
  timestamp: number;
  foodId: string;
  taste: string;
  satisfactionChange: number;
}

const feedHistory: FeedHistoryEntry[] = [];

export async function logFeed(entry: FeedHistoryEntry): Promise<{ success: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      feedHistory.push(entry);
      resolve({ success: true });
    }, 100);
  });
}

export async function getFeedHistory(
  limit: number = 10
): Promise<FeedHistoryEntry[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...feedHistory].slice(-limit).reverse());
    }, 200);
  });
}
