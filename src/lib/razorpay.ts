import Razorpay from "razorpay"
import { validatePaymentVerification, validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils"

let instance: Razorpay | null = null

function getInstance() {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_id || !key_secret) {
      throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables")
    }
    instance = new Razorpay({ key_id, key_secret })
  }
  return instance
}

export function getRazorpayInstance() {
  return getInstance()
}

export async function createOrder(amountInPaise: number, receipt: string, notes?: Record<string, string>) {
  return getInstance().orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes,
  })
}

export async function fetchOrder(orderId: string) {
  return getInstance().orders.fetch(orderId) as Promise<{
    id: string
    amount: number
    currency: string
    receipt: string
    status: string
    notes: Record<string, string>
  }>
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  return validatePaymentVerification(
    { order_id: orderId, payment_id: paymentId },
    signature,
    process.env.RAZORPAY_KEY_SECRET!
  )
}

export function verifyWebhookSignature(body: string, signature: string) {
  return validateWebhookSignature(body, signature, process.env.RAZORPAY_WEBHOOK_SECRET!)
}

export async function createPayout(amountInPaise: number, upiId: string, name: string, referenceId: string, notes?: Record<string, string>) {
  const result = await getInstance().api.post<Record<string, unknown>, { id: string }>({
    url: "/v1/payouts",
    data: {
      account_number: process.env.RAZORPAY_ACCOUNT_NUMBER!,
      fund_account: {
        account_type: "vpa",
        vpa: { address: upiId },
        contact: {
          name,
          type: "customer",
        },
      },
      amount: amountInPaise,
      currency: "INR",
      mode: "UPI",
      purpose: "payout",
      queue_if_low_balance: true,
      reference_id: referenceId,
      notes,
    },
  })
  return result
}
