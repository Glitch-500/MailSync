---
name: mailsync-integration
description: >-
  Use this skill when integrating a hosted or self-hosted MailSync email API (e.g., https://mailsync-sigma.vercel.app or a private Vercel/Netlify/Docker instance) into any web application or backend service (Next.js, Node.js/Express, Python/FastAPI, React, PHP, Go). Covers endpoint configuration, authentication headers, request payload schemas, TypeScript/JavaScript/Python client wrappers, and error handling.
---

# MailSync Integration Skill

This skill guides an AI agent or developer through integrating a hosted or self-hosted **MailSync** email-sending API into any client application or backend service.

---

## 1. Quick Overview & API Contract

MailSync exposes a clean, single endpoint for dispatching transactional emails:

- **Endpoint**: `POST /mail` (or `POST /api/mail`)
- **Base URL**: Your hosted MailSync URL (e.g., `https://mailsync-sigma.vercel.app` or `http://localhost:5000`)
- **Headers**:
  - `Content-Type: application/json` (Required)
  - `x-access-key: <YOUR_ACCESS_KEY>` (Required if `ACCESS_KEY` is configured on the MailSync instance; also supports `Authorization: Bearer <YOUR_ACCESS_KEY>`)
- **Healthcheck**: `GET /health` returns `{ "status": "ok", "service": "MailSync" }`

### Request Body Schema (JSON)

| Field | Type | Required | Description |
|---|---|---|---|
| `email` or `to` | `string` | **Yes** | Target recipient email address |
| `message` | `string` | **Yes\*** | Plaintext email body (auto-wrapped in responsive HTML layout) |
| `html` | `string` | No\* | Custom HTML markup (overrides default auto-wrapped layout) |
| `subject` | `string` | No | Email subject line (default: `"New Notification from MailSync"`) |
| `name` | `string` | No | Recipient name for personal greeting (e.g. `"Hello Alex,"`) |
| `fromName` | `string` | No | Custom sender display name (e.g. `"Acme Team"`) |
| `from` | `string` | No | Full RFC sender string (e.g. `"Acme Support" <support@domain.com>`) |

*\* Either `message` or `html` must be provided.*

### Response Schema

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<b6589fc6-8e12-7dc2-359a-20a52cfa4323@gmail.com>",
  "recipient": "recipient@example.com"
}
```

---

## 2. Step-by-Step Integration Workflow

When instructed to integrate MailSync into a user's application, execute these steps:

### Step 1: Configure Environment Variables
Ensure the user's application defines the MailSync URL and access key in `.env` (or `.env.local`):

```env
# MailSync Hosted API Configuration
MAILSYNC_API_URL=https://mailsync-sigma.vercel.app
MAILSYNC_ACCESS_KEY=your-optional-access-key
```

> **Security Note:** Never expose `MAILSYNC_ACCESS_KEY` in client-side/browser bundles. Call the MailSync endpoint from server-side handlers (Next.js Server Actions/Route Handlers, Express routes, FastAPI endpoints).

### Step 2: Implement Client Helper Module
Create a reusable mailer utility in the application (e.g., `lib/mailsync.ts` or `services/email.ts`).

Refer to pre-built reference implementations:
- [TypeScript / Next.js Helper](./examples/nextjs-mailsync.ts)
- [Node.js / Express Helper](./examples/node-mailsync.js)
- [Python Service Helper](./examples/python-mailsync.py)

### Step 3: Replace Existing Email Providers
If replacing another email provider (such as Resend, SendGrid, or local Nodemailer):
1. Find existing mail call sites (e.g. `resend.emails.send(...)` or `transporter.sendMail(...)`).
2. Map the payload fields:
   - `to` &rarr; `email` (or `to`)
   - `subject` &rarr; `subject`
   - `text` &rarr; `message`
   - `html` &rarr; `html`
   - `from` &rarr; `fromName` or `from`
3. Remove obsolete SDK dependencies if no longer needed.

### Step 4: Verify Connectivity
Run a quick connectivity check:
1. Hit `GET ${MAILSYNC_API_URL}/health` to verify server availability.
2. Dispatch a test email and confirm HTTP 200 with `{ "success": true }`.

---

## 3. Reference Implementations

- **[Next.js App Router (TypeScript)](./examples/nextjs-mailsync.ts)**: Works seamlessly with Next.js 13/14/15 Route Handlers and Server Actions.
- **[Node.js / Express](./examples/node-mailsync.js)**: Standard fetch-based utility with timeout and retry logic.
- **[Python (Requests / HTTPX)](./examples/python-mailsync.py)**: Python helper class for FastAPI, Django, or Flask apps.
- **[API Reference & Edge Cases](./references/api-reference.md)**: Details on rate limits, status codes, watermarking, and error recovery.
