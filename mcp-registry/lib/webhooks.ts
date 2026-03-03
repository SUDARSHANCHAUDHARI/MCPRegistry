// Webhook integrations for external service events
// Handles GitHub webhooks, health check notifications, analytics events

import crypto from 'crypto'

export type WebhookEvent = 'github-stars' | 'server-health' | 'analytics' | 'submission-auto-approve'

interface GitHubStarsData {
  repository: string
  owner: string
  stars: number
}

interface ServerHealthData {
  serverId: string
  status: 'healthy' | 'unhealthy' | 'timeout'
  lastChecked: string
  details?: string
}

interface AnalyticsData {
  eventType: 'submit' | 'search' | 'rating' | 'view'
  serverId?: string
  timestamp: string
  metadata?: Record<string, any>
}

interface SubmissionAutoApproveData {
  serverId: string
  reason: string
}

type WebhookData = GitHubStarsData | ServerHealthData | AnalyticsData | SubmissionAutoApproveData

interface WebhookPayload {
  event: WebhookEvent
  timestamp: number
  data: Record<string, any>
  signature?: string // For verification
}

// Verify webhook signature (for security)
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto.createHmac('sha256', secret).update(payload).digest('hex')
  return hash === signature
}

// Webhook handlers for different event types
export async function handleGitHubStarsWebhook(data: {
  repository: string
  owner: string
  stars: number
}) {
  // Called when GitHub repository gets new stars
  // Update the server's GitHub stars count in database
  console.log(`Updated ${data.owner}/${data.repository}: ${data.stars} stars`)
  
  // TODO: Implement database update
  // const serverId = await findServerByGitHub(data.repository)
  // await updateServerStars(serverId, data.stars)
}

export async function handleServerHealthWebhook(data: {
  serverId: string
  status: 'healthy' | 'unhealthy' | 'timeout'
  lastChecked: string
  details?: string
}) {
  // Called when health check runs on a server
  // Update health status in database
  console.log(`Server ${data.serverId} health: ${data.status}`)
  
  // TODO: Implement health status update
  // await updateServerHealth(data.serverId, {
  //   status: data.status,
  //   lastChecked: new Date(data.lastChecked),
  //   details: data.details,
  // })
}

export async function handleAnalyticsWebhook(data: {
  eventType: 'view' | 'search' | 'submit' | 'rating'
  serverId?: string
  timestamp: string
  metadata?: Record<string, any>
}) {
  // Called to log analytics events
  console.log(`Analytics: ${data.eventType} at ${data.timestamp}`)
  
  // TODO: Implement analytics tracking
  // await trackAnalyticsEvent(data.eventType, {
  //   serverId: data.serverId,
  //   timestamp: new Date(data.timestamp),
  //   metadata: data.metadata,
  // })
}

export async function handleSubmissionAutoApproveWebhook(data: {
  serverId: string
  reason: string // e.g., 'verified_github', 'trusted_owner'
}) {
  // Called to auto-approve a submission based on criteria
  console.log(`Auto-approving server ${data.serverId}: ${data.reason}`)
  
  // TODO: Implement auto-approval
  // await approveServer(data.serverId, {
  //   autoApproved: true,
  //   reason: data.reason,
  // })
}

// Main webhook processor
export async function processWebhook(payload: WebhookPayload): Promise<{
  success: boolean
  message: string
}> {
  try {
    switch (payload.event) {
      case 'github-stars': {
        const data = payload.data as GitHubStarsData
        await handleGitHubStarsWebhook(data)
        break
      }
      case 'server-health': {
        const data = payload.data as ServerHealthData
        await handleServerHealthWebhook(data)
        break
      }
      case 'analytics': {
        const data = payload.data as AnalyticsData
        await handleAnalyticsWebhook(data)
        break
      }
      case 'submission-auto-approve': {
        const data = payload.data as SubmissionAutoApproveData
        await handleSubmissionAutoApproveWebhook(data)
        break
      }
      default:
        throw new Error(`Unknown webhook event: ${(payload as any).event}`)
    }
    
    return { success: true, message: `Processed ${payload.event} webhook` }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return { success: false, message: String(error) }
  }
}

// Webhook delivery function (for outgoing webhooks)
export async function sendWebhook(
  url: string,
  payload: WebhookPayload,
  secret?: string
): Promise<boolean> {
  try {
    const body = JSON.stringify(payload)
    const signature = secret ? crypto.createHmac('sha256', secret).update(body).digest('hex') : undefined

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(signature && { 'X-Webhook-Signature': signature }),
      },
      body,
    })

    return response.ok
  } catch (error) {
    console.error('Webhook delivery failed:', error)
    return false
  }
}

// Schedule webhook delivery with retry logic
export async function scheduleWebhookDelivery(
  url: string,
  payload: WebhookPayload,
  secret?: string,
  maxRetries = 3
): Promise<boolean> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const success = await sendWebhook(url, payload, secret)
    if (success) return true

    // Exponential backoff: 5s, 25s, 125s
    const delay = Math.pow(5, attempt + 1) * 1000
    await new Promise(r => setTimeout(r, delay))
  }

  return false
}
