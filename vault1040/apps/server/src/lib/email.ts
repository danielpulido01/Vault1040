import { Resend } from 'resend';
import { config } from '../config/index.js';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  tags?: string[];
}

interface SendPrefillInvitationParams {
  to: string;
  clientName: string;
  businessName: string;
  reportYear: number;
  prefillUrl: string;
  expiresAt: Date;
}

// Send email using Resend (preferred) or Mailchimp Transactional (Mandrill)
export async function sendEmail(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text } = params;

  // Try Resend first if configured
  if (config.resend?.apiKey) {
    return sendWithResend(params);
  }

  // Fall back to Mailchimp/Mandrill
  if (config.mailchimp.apiKey) {
    return sendWithMandrill(params);
  }

  console.warn('No email provider configured, skipping email send');
  return { success: false, error: 'Email not configured' };
}

async function sendWithResend(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text } = params;
  const resend = new Resend(config.resend!.apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from: `${config.resend!.fromName} <${config.resend!.fromEmail}>`,
      to: [to],
      subject,
      html,
      text: text || stripHtml(html),
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Failed to send email with Resend:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

async function sendWithMandrill(params: SendEmailParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, html, text, tags = [] } = params;

  try {
    const response = await fetch('https://mandrillapp.com/api/1.0/messages/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: config.mailchimp.apiKey,
        message: {
          from_email: config.mailchimp.fromEmail,
          from_name: config.mailchimp.fromName,
          to: [{ email: to, type: 'to' }],
          subject,
          html,
          text: text || stripHtml(html),
          tags,
        },
      }),
    });

    const data = await response.json() as Array<{ status: string; _id: string; reject_reason?: string }>;

    if (data[0]?.status === 'sent' || data[0]?.status === 'queued') {
      return { success: true, messageId: data[0]._id };
    }

    return { success: false, error: data[0]?.reject_reason || 'Unknown error' };
  } catch (error) {
    console.error('Failed to send email with Mandrill:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

// Send pre-fill invitation email
export async function sendPrefillInvitationEmail(params: SendPrefillInvitationParams): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, clientName, businessName, reportYear, prefillUrl, expiresAt } = params;

  const expiresFormatted = expiresAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${reportYear} Annual Report is Ready</title>
  <style>
    body {
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #0d0a24;
      font-size: 28px;
      margin: 0;
    }
    .logo span {
      color: #00d88d;
    }
    h2 {
      color: #0d0a24;
      font-size: 24px;
      margin-top: 0;
    }
    .business-name {
      background: #f8f9fa;
      border-left: 4px solid #00d88d;
      padding: 15px 20px;
      margin: 20px 0;
      font-weight: 600;
      color: #0d0a24;
    }
    .steps {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 20px 25px;
      margin: 25px 0;
    }
    .steps h3 {
      color: #0d0a24;
      margin-top: 0;
      font-size: 16px;
    }
    .steps ol {
      margin: 0;
      padding-left: 20px;
    }
    .steps li {
      margin: 8px 0;
      color: #555;
    }
    .button {
      display: inline-block;
      background: #00d88d;
      color: white !important;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
    }
    .button:hover {
      background: #00c57d;
    }
    .text-center {
      text-align: center;
    }
    .expires {
      color: #888;
      font-size: 14px;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      color: #888;
      font-size: 13px;
    }
    .footer a {
      color: #00d88d;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <h1>Vault<span>1040</span></h1>
      </div>

      <h2>Your ${reportYear} Florida Annual Report is Ready</h2>

      <p>Hi ${clientName},</p>

      <p>We've pre-filled your Florida Annual Report using your information from the previous year. Your report for:</p>

      <div class="business-name">
        ${businessName}
      </div>

      <div class="steps">
        <h3>What you need to do:</h3>
        <ol>
          <li>Click the button below to review your pre-filled report</li>
          <li>Verify all information is current and accurate</li>
          <li>Make any necessary updates</li>
          <li>Submit and pay the filing fee</li>
        </ol>
      </div>

      <div class="text-center">
        <a href="${prefillUrl}" class="button">Review Your Annual Report</a>
      </div>

      <p class="expires">
        This link expires on ${expiresFormatted}. If you need a new link, please contact us.
      </p>

      <div class="footer">
        <p>Questions? Reply to this email or call us at (305) 555-1040</p>
        <p>&copy; ${new Date().getFullYear()} Vault1040. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

  const text = `
Your ${reportYear} Florida Annual Report is Ready

Hi ${clientName},

We've pre-filled your Florida Annual Report using your information from the previous year.

Business: ${businessName}

What you need to do:
1. Click the link below to review your pre-filled report
2. Verify all information is current and accurate
3. Make any necessary updates
4. Submit and pay the filing fee

Review Your Annual Report: ${prefillUrl}

This link expires on ${expiresFormatted}.

Questions? Reply to this email or call us at (305) 555-1040

Vault1040
`;

  return sendEmail({
    to,
    subject: `Your ${reportYear} Annual Report for ${businessName} - Pre-filled & Ready`,
    html,
    text,
    tags: ['annual-report', 'prefill-invitation'],
  });
}

// Simple HTML to text converter
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
