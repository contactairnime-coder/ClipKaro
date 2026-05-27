import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-check"
import { runFraudChecks } from "@/lib/fraud/detector"
import { handleFraudResult } from "@/lib/fraud/actions"

export async function POST(request: Request, { params }: { params: { submissionId: string } }) {
  const forbidden = await requireAdmin()
  if (forbidden) return forbidden

  const fraudResult = await runFraudChecks(params.submissionId)

  const action = await handleFraudResult(
    params.submissionId,
    fraudResult.score,
    fraudResult.recommendation
  )

  return NextResponse.json({
    fraudResult,
    action,
  })
}
