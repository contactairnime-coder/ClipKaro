import Razorpay from "razorpay"
import { validatePaymentVerification, validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils"

const key_id = process.env.RAZORPAY_KEY_ID!
const key_secret = process.env.RAZORPAY_KEY_SECRET!

const instance = new Razorpay({ key_id, key_secret })

export function getRazorpayInstance() {
  return instance
}

export async function createOrder(amountInPaise: number, receipt: string, notes?: Record<string, string>) {
  return instance.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
    notes,
  })
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
  const result = await instance.api.post<Record<string, unknown>, { id: string }>({
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
