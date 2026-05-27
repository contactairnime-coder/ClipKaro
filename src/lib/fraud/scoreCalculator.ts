export type FraudRecommendation = "safe" | "flag" | "reject"

export function calculateFraudScore(checkScores: number[]): {
  totalScore: number
  recommendation: FraudRecommendation
} {
  const totalScore = Math.min(100, checkScores.reduce((sum, s) => sum + s, 0))

  let recommendation: FraudRecommendation
  if (totalScore >= 70) {
    recommendation = "reject"
  } else if (totalScore >= 40) {
    recommendation = "flag"
  } else {
    recommendation = "safe"
  }

  return { totalScore, recommendation }
}
