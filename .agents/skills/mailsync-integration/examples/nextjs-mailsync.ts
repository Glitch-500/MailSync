/**
 * MailSync Client Helper for Next.js (App Router, Server Actions, Route Handlers)
 *
 * Requirements:
 * Add to your .env or .env.local:
 *   MAILSYNC_API_URL=https://mailsync-sigma.vercel.app
 *   MAILSYNC_ACCESS_KEY=your-secret-access-key (if configured)
 */

export interface SendEmailOptions {
  to: string;
  subject?: string;
  message?: string;
  html?: string;
  name?: string;
  fromName?: string;
}

export interface MailSyncResponse {
  success: boolean;
  message?: string;
  messageId?: string;
  recipient?: string;
  error?: string;
  details?: string;
}

/**
 * Sends an email using the hosted MailSync API
 */
export async function sendMail(options: SendEmailOptions): Promise<MailSyncResponse> {
  const baseUrl = process.env.MAILSYNC_API_URL;
  if (!baseUrl) {
    throw new Error("MAILSYNC_API_URL environment variable is not defined");
  }

  const accessKey = process.env.MAILSYNC_ACCESS_KEY;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessKey) {
    headers["x-access-key"] = accessKey;
  }

  const normalizedUrl = baseUrl.replace(/\/+$/, "") + "/mail";

  const response = await fetch(normalizedUrl, {
    method: "POST",
    headers,
    body: JSON.stringify({
      email: options.to,
      subject: options.subject,
      name: options.name,
      message: options.message,
      html: options.html,
      fromName: options.fromName,
    }),
    // Ensure fresh response without static caching in Next.js
    cache: "no-store",
  });

  const data: MailSyncResponse = await response.json();

  if (!response.ok || !data.success) {
    const errorMsg = data.error || data.details || `MailSync failed with HTTP ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

/**
 * Example usage in a Next.js Server Action:
 *
 * "use server";
 * import { sendMail } from "@/lib/mailsync";
 *
 * export async function handleContactForm(formData: FormData) {
 *   const email = formData.get("email") as string;
 *   const message = formData.get("message") as string;
 *
 *   await sendMail({
 *     to: email,
 *     subject: "We received your inquiry!",
 *     message: message,
 *     fromName: "Acme Support",
 *   });
 * }
 */
