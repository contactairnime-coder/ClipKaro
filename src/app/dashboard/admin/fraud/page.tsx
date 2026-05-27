"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

type FraudFlag = {
  id: string
  flagType: string
  details: string | null
  isResolved: boolean
  createdAt: string
  submission: {
    id: string
    submittedUrl: string
    viewCount: number
    status: string
    campaign: { title: string }
    clipper: { id: string; name: string | null; email: string }
    snapshots: Array<{ viewCount: number; recordedAt: string }>
  }
}

type FraudCheckResult = {
  name: string
  score: number
  details: string | null
  passed: boolean
}

type FraudResponse = {
  fraudResult: {
    score: number
    recommendation: string
    checks: FraudCheckResult[]
  }
}

const flagColors: Record<string, string> = {
  VIEW_VELOCITY: "bg-orange-100 text-orange-800",
  ENGAGEMENT_RATIO: "bg-purple-100 text-purple-800",
  ACCOUNT_AGE: "bg-blue-100 text-blue-800",
  DUPLICATE: "bg-red-100 text-red-800",
  GEOGRAPHIC: "bg-yellow-100 text-yellow-800",
}

export default function FraudQueue() {
  const [flags, setFlags] = useState<FraudFlag[]>([])
  const [loading, setLoading] = useState(true)
  const [fraudResults, setFraudResults] = useState<Record<string, FraudCheckResult[]>>({})
  const [checkingIds, setCheckingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetch("/api/admin/fraud")
      .then((r) => r.json())
      .then(setFlags)
      .finally(() => setLoading(false))
  }, [])

  async function runChecks(submissionId: string) {
    setCheckingIds((prev) => new Set(prev).add(submissionId))
    const res = await fetch(`/api/fraud/check/${submissionId}`, { method: "POST" })
    const data: FraudResponse = await res.json()
    if (res.ok) {
      setFraudResults((prev) => ({ ...prev, [submissionId]: data.fraudResult.checks }))
      if (data.fraudResult.recommendation === "reject") {
        toast.error(`Auto-rejected (score: ${data.fraudResult.score})`)
        setFlags((prev) => prev.filter((f) => f.submission.id !== submissionId))
      } else if (data.fraudResult.recommendation === "safe") {
        toast.success(`Auto-approved (score: ${data.fraudResult.score})`)
        setFlags((prev) => prev.filter((f) => f.submission.id !== submissionId))
      } else {
        toast.info(`Flagged (score: ${data.fraudResult.score}) — review required`)
      }
    } else {
      toast.error("Fraud check failed")
    }
    setCheckingIds((prev) => { const next = new Set(prev); next.delete(submissionId); return next })
  }

  async function overrideAction(submissionId: string, action: "approve" | "reject") {
    const res = await fetch(`/api/fraud/override/${submissionId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, reason: action === "reject" ? "Admin confirmed fraud" : "Admin override" }),
    })
    if (res.ok) {
      toast.success(`Submission ${action}d`)
      setFlags((prev) => prev.filter((f) => f.submission.id !== submissionId))
    } else {
      toast.error("Failed to override")
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 70) return "text-red-600 bg-red-50"
    if (score >= 40) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  if (loading) return <div className="h-64 animate-pulse rounded bg-muted" />

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Fraud Queue</h1>
        <p className="text-muted-foreground">{flags.length} unresolved flags</p>
      </div>

      {flags.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-lg font-medium">No fraud flags 🎉</p>
            <p className="text-sm text-muted-foreground">All submissions look clean.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {flags.map((flag) => {
            const results = fraudResults[flag.submission.id]
            const isChecking = checkingIds.has(flag.submission.id)

            return (
              <Card key={flag.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge className={flagColors[flag.flagType]}>{flag.flagType}</Badge>
                        <span className="text-sm text-muted-foreground">{new Date(flag.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 space-y-1 text-sm">
                        <p><span className="font-medium">Campaign:</span> {flag.submission.campaign.title}</p>
                        <p><span className="font-medium">Clipper:</span> {flag.submission.clipper.name || flag.submission.clipper.email}</p>
                        <p><span className="font-medium">URL:</span> <a href={flag.submission.submittedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{flag.submission.submittedUrl.slice(0, 50)}...</a></p>
                        <p><span className="font-medium">Views:</span> {flag.submission.viewCount.toLocaleString()}</p>
                        {flag.details && <p><span className="font-medium">Details:</span> {flag.details}</p>}
                      </div>

                      {results && (
                        <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="text-xs font-medium">Fraud Score:</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${getScoreColor(results.reduce((s, c) => s + c.score, 0))}`}>
                              {results.reduce((s, c) => s + c.score, 0)}/100
                            </span>
                          </div>
                          <div className="space-y-1">
                            {results.map((check) => (
                              <div key={check.name} className="flex items-center gap-2 text-xs">
                                <span className={`h-2 w-2 rounded-full ${check.passed ? "bg-green-500" : "bg-red-500"}`} />
                                <span className="font-medium">{check.name}:</span>
                                <span className={check.passed ? "text-green-600" : "text-red-600"}>
                                  {check.passed ? "PASS" : `FAIL (${check.score})`}
                                </span>
                                {check.details && <span className="text-muted-foreground">— {check.details}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {flag.submission.snapshots.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground">View Snapshots:</p>
                          <div className="mt-1 flex gap-2">
                            {flag.submission.snapshots.slice(0, 5).map((s, i) => (
                              <span key={i} className="rounded bg-muted px-2 py-1 text-xs">
                                {s.viewCount} ({new Date(s.recordedAt).toLocaleDateString()})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="outline" disabled={isChecking} onClick={() => runChecks(flag.submission.id)}>
                        {isChecking ? "Checking..." : "Run Fraud Check"}
                      </Button>
                      {results && (
                        <>
                          <Button size="sm" variant="default" onClick={() => overrideAction(flag.submission.id, "approve")}>
                            Override & Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => overrideAction(flag.submission.id, "reject")}>
                            Confirm Fraud
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
