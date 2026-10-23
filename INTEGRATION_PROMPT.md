# MailSync AI Agent Guided Prompt

Use this guided prompt with any AI coding assistant (**Antigravity, Cursor, Claude Code, Windsurf, GitHub Copilot, or ChatGPT**) to instantly implement your hosted MailSync email API into your application.

---

## 📋 Copy-and-Paste Agent Prompt

Copy the prompt below, replace `[HOSTED_URL]` with your live MailSync URL (e.g., `https://mailsync-sigma.vercel.app` or your self-hosted instance), and paste it into your AI assistant:

```markdown
Please implement transactional email sending in this application using our hosted MailSync API instance.

### MailSync Instance Details:
- Base API URL: [HOSTED_URL] (e.g., https://mailsync-sigma.vercel.app)
- Access Key (if required): [YOUR_ACCESS_KEY or none]
- Endpoint: POST /mail (or POST /api/mail)

### API Contract:
1. Headers:
   - Content-Type: application/json
   - x-access-key: [YOUR_ACCESS_KEY] (only include if an access key is set)
2. Request Body (JSON):
   - email: string (required) - recipient address (or "to")
   - message: string (required if html is not provided) - plaintext message body
   - html: string (optional) - custom HTML markup (overrides plain message)
   - subject: string (optional) - email subject line
   - name: string (optional) - recipient name for greeting
   - fromName: string (optional) - sender display name (e.g. "Acme Notifications")
3. Response:
   - Success (200): { "success": true, "message": "Email sent successfully", "messageId": "...", "recipient": "..." }
   - Error (400/401/500): { "success": false, "error": "...", "details": "..." }

### Implementation Steps Required:
1. Environment Configuration:
   - Add MAILSYNC_API_URL=[HOSTED_URL] to .env (and .env.example / .env.local).
   - If an access key is used, add MAILSYNC_ACCESS_KEY to .env.
2. Email Service Utility:
   - Create a clean, reusable email helper (e.g., `lib/mailsync.ts`, `services/email.ts`, or `utils/mailer.py` depending on the project language).
   - Handle network errors, HTTP status codes, and timeouts gracefully.
   - Keep API keys strictly server-side (do NOT expose in client-side bundles).
3. Connect Email Triggers:
   - Integrate the helper into the relevant feature (e.g., contact form, user registration, OTP verification, or notification workflow).
4. Connectivity Test:
   - Verify the endpoint works by making a test dispatch or testing against GET [HOSTED_URL]/health.
```

---

## 🛠️ Framework-Specific Quick References

### Next.js (App Router / Server Actions)
```typescript
// lib/mailsync.ts
export async function sendEmail({
  to,
  subject,
  message,
  html,
  fromName,
}: {
  to: string;
  subject?: string;
  message?: string;
  html?: string;
  fromName?: string;
}) {
  const url = `${process.env.MAILSYNC_API_URL?.replace(/\/+$/, "")}/mail`;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.MAILSYNC_ACCESS_KEY) {
    headers["x-access-key"] = process.env.MAILSYNC_ACCESS_KEY;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: to, subject, message, html, fromName }),
    cache: "no-store",
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || data.details || "Failed to send email");
  }
  return data;
}
```

### Node.js / Express
```javascript
// services/mailer.js
async function sendEmail({ to, subject, message, html, fromName }) {
  const url = `${process.env.MAILSYNC_API_URL.replace(/\/+$/, "")}/mail`;
  const headers = { "Content-Type": "application/json" };
  if (process.env.MAILSYNC_ACCESS_KEY) {
    headers["x-access-key"] = process.env.MAILSYNC_ACCESS_KEY;
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ email: to, subject, message, html, fromName }),
  });
  return await res.json();
}
```

### Python (FastAPI / Django / Flask)
```python
# services/mailer.py
import os
import requests

def send_email(to: str, subject: str, message: str = None, html: str = None, from_name: str = None):
    url = f"{os.getenv('MAILSYNC_API_URL').rstrip('/')}/mail"
    headers = {"Content-Type": "application/json"}
    if os.getenv("MAILSYNC_ACCESS_KEY"):
        headers["x-access-key"] = os.getenv("MAILSYNC_ACCESS_KEY")
    
    payload = {"email": to, "subject": subject, "fromName": from_name}
    if message: payload["message"] = message
    if html: payload["html"] = html
    
    r = requests.post(url, json=payload, headers=headers, timeout=10)
    return r.json()
```

---

## ⚡ Using the Antigravity Agent Skill
If your project uses the **Antigravity IDE** or the `agy` CLI:
1. Copy the `.agents/skills/mailsync-integration` folder into your target repository's `.agents/skills/` directory.
2. The agent will automatically discover the `mailsync-integration` skill and apply all best practices without manual prompt engineering!
