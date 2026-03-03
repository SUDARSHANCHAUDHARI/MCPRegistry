// Email notification templates and utilities
// This integrates with Resend, SendGrid, or similar email services

export type EmailTemplate = 'server-submitted' | 'server-approved' | 'server-rejected' | 'rating-notification'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export function getEmailTemplate(
  template: EmailTemplate,
  data: Record<string, string | number>
): EmailOptions {
  switch (template) {
    case 'server-submitted':
      return {
        to: data.email as string,
        subject: '✅ Server Submission Received — MCP Registry',
        html: `
          <h2>Thanks for Submitting ${data.serverName}!</h2>
          <p>We've received your MCP server submission and our team will review it shortly.</p>
          <p><strong>Server:</strong> ${data.serverName}</p>
          <p><strong>Status:</strong> Pending Review</p>
          <p>You can track the status on your <a href="${data.dashboardUrl}">Dashboard</a>.</p>
          <p>We typically review submissions within 24-48 hours.</p>
          <p>Happy coding! 🚀</p>
        `,
      }

    case 'server-approved':
      return {
        to: data.email as string,
        subject: '🎉 Your Server is Now Live — MCP Registry',
        html: `
          <h2>🎉 ${data.serverName} is Now Live!</h2>
          <p>Congratulations! Your MCP server has been approved and is now live on the registry.</p>
          <p><a href="${data.serverUrl}">View your server →</a></p>
          <p>You can track stats and ratings on your <a href="${data.dashboardUrl}">Dashboard</a>.</p>
          <p>Share it with the community on:</p>
          <ul>
            <li><a href="https://twitter.com/intent/tweet?text=Just published ${data.serverName} on MCP Registry&url=${data.serverUrl}">Twitter/X</a></li>
            <li><a href="https://reddit.com">Reddit r/Claude</a></li>
            <li><a href="https://news.ycombinator.com/submit">Hacker News</a></li>
          </ul>
          <p>Thank you for contributing to the MCP ecosystem! 💙</p>
        `,
      }

    case 'server-rejected':
      return {
        to: data.email as string,
        subject: '📝 Feedback on Your Server Submission — MCP Registry',
        html: `
          <h2>Feedback on ${data.serverName}</h2>
          <p>Thanks for your submission! We had some feedback and would love for you to make a few adjustments:</p>
          <p><strong>Reason:</strong></p>
          <p>${data.reason}</p>
          <p>Feel free to revise and resubmit. We're excited to help get your server in the registry!</p>
          <p><a href="/submit">Resubmit your server →</a></p>
          <p>Questions? Reply to this email or open an issue on GitHub.</p>
        `,
      }

    case 'rating-notification':
      return {
        to: data.email as string,
        subject: `⭐ New Review on ${data.serverName}`,
        html: `
          <h2>New Review on ${data.serverName}</h2>
          <p><strong>${data.reviewerName}</strong> left a ${data.rating}-star review on your server.</p>
          <p style="font-style: italic;">"${data.reviewText}"</p>
          <p><a href="${data.serverUrl}">View all reviews →</a></p>
          <p>Thanks for building awesome tools! 🙌</p>
        `,
      }

    default:
      throw new Error(`Unknown email template: ${template}`)
  }
}

// Integration point for your email service (Resend, SendGrid, etc.)
export async function sendEmail(options: EmailOptions, provider: 'resend' | 'sendgrid' = 'resend') {
  try {
    if (provider === 'resend' && process.env.RESEND_API_KEY) {
      // Placeholder for Resend integration
      // const { Resend } = await import('resend')
      // const resend = new Resend(process.env.RESEND_API_KEY)
      // await resend.emails.send({
      //   from: 'noreply@mcp-registry.com',
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html,
      // })
      console.log(`📧 Email sent via Resend to ${options.to}`)
    } else if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      // Placeholder for SendGrid integration
      console.log(`📧 Email sent via SendGrid to ${options.to}`)
    } else {
      console.log(`📧 Email service not configured. Skipping: ${options.subject}`)
    }
  } catch (error) {
    console.error('Failed to send email:', error)
    // Silently fail for now - in production, log to error tracking service
  }
}

// Helper to send email notifications
export async function notifyServerSubmitted(
  email: string,
  serverName: string,
  dashboardUrl: string
) {
  const template = getEmailTemplate('server-submitted', {
    email,
    serverName,
    dashboardUrl,
  })
  await sendEmail(template)
}

export async function notifyServerApproved(
  email: string,
  serverName: string,
  serverUrl: string,
  dashboardUrl: string
) {
  const template = getEmailTemplate('server-approved', {
    email,
    serverName,
    serverUrl,
    dashboardUrl,
  })
  await sendEmail(template)
}

export async function notifyServerRejected(
  email: string,
  serverName: string,
  reason: string
) {
  const template = getEmailTemplate('server-rejected', {
    email,
    serverName,
    reason,
  })
  await sendEmail(template)
}

export async function notifyNewRating(
  email: string,
  serverName: string,
  reviewerName: string,
  rating: number,
  reviewText: string,
  serverUrl: string
) {
  const template = getEmailTemplate('rating-notification', {
    email,
    serverName,
    reviewerName,
    rating,
    reviewText,
    serverUrl,
  })
  await sendEmail(template)
}
