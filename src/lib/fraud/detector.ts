import { checkViewVelocity } from "./checks/viewVelocity"
import { checkEngagementRatio } from "./checks/engagementRatio"
import { checkAccountAge } from "./checks/accountAge"
import { checkDuplicate } from "./checks/duplicate"
import { checkViewSpike } from "./checks/viewSpike"
import { calculateFraudScore } from "./scoreCalculator"
import type { FraudRecommendation } from "./scoreCalculator"

export type CheckResult = {
  name: string
  score: number
  details: string | null
  passed: boolean
}

export type FraudResult = {
  submissionId: string
  score: number
  recommendation: FraudRecommendation
  checks: CheckResult[]
}

export async function runFraudChecks(submissionId: string): Promise<FraudResult> {
  const checks = await Promise.all([
    checkViewVelocity(submissionId).then((r) => ({ name: "View Velocity", ...r })),
    checkEngagementRatio(submissionId).then((r) => ({ name: "Engagement Ratio", ...r })),
    checkAccountAge(submissionId).then((r) => ({ name: "Account Age", ...r })),
    checkDuplicate(submissionId).then((r) => ({ name: "Duplicate Check", ...r })),
    checkViewSpike(submissionId).then((r) => ({ name: "View Spike", ...r })),
  ])

  const checkResults: CheckResult[] = checks.map((c) => ({
    name: c.name,
    score: c.score,
    details: c.details,
    passed: c.score === 0,
  }))

  const { totalScore, recommendation } = calculateFraudScore(checks.map((c) => c.score))

  return {
    submissionId,
    score: totalScore,
    recommendation,
    checks: checkResults,
  }
}
