export enum Rank {
  ROOKIE = "ROOKIE",
  ANALYST = "ANALYST",
  STRATEGIST = "STRATEGIST",
  EXPERT = "EXPERT",
  ORACLE = "ORACLE",
  GRAND_ORACLE = "GRAND_ORACLE",
}
export interface UserReputationStats {
  predictionCount: number;
  correctPredictions: number;
  incorrectPredictions: number;
  accuracyRate: number;
  currentStreak: number;
  longestStreak: number;
  trustScore: number;
  rank: Rank;
}
export function calculateNewReputation(
  currentStats: UserReputationStats,
  isCorrect: boolean,
  confidence: number
): UserReputationStats {
  const predictionCount = currentStats.predictionCount + 1;
  const correctPredictions = isCorrect ? currentStats.correctPredictions + 1 : currentStats.correctPredictions;
  const incorrectPredictions = isCorrect ? currentStats.incorrectPredictions : currentStats.incorrectPredictions + 1;
  const accuracyRate = (correctPredictions / predictionCount) * 100;
  const currentStreak = isCorrect ? currentStats.currentStreak + 1 : 0;
  const longestStreak = Math.max(currentStats.longestStreak, currentStreak);
  const impact = (confidence / 100) * 5;
  let trustScore = isCorrect ? currentStats.trustScore + impact : currentStats.trustScore - (impact * 1.5);
  trustScore = Math.max(0, Math.min(100, trustScore));
  let rank = Rank.ROOKIE;
  if (trustScore >= 90 && predictionCount >= 50) rank = Rank.GRAND_ORACLE;
  else if (trustScore >= 80 && predictionCount >= 30) rank = Rank.ORACLE;
  else if (trustScore >= 70 && predictionCount >= 20) rank = Rank.EXPERT;
  else if (trustScore >= 60 && predictionCount >= 10) rank = Rank.STRATEGIST;
  else if (trustScore >= 50 && predictionCount >= 5) rank = Rank.ANALYST;
  return { predictionCount, correctPredictions, incorrectPredictions, accuracyRate, currentStreak, longestStreak, trustScore, rank };
}
