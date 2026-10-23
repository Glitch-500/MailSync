# Contributing to MailSync ⚡

Thank you for your interest in contributing to **MailSync**! We welcome all contributions from developers of all skill levels—whether you're fixing a bug, adding new email templates, improving documentation, or optimizing deployment adapters.

---

## 🌟 Code of Conduct

By participating in this project, you agree to abide by common open-source standards:
- Treat everyone with respect and kindness.
- Welcome newcomers and be constructive with feedback.
- Focus on what is best for the community and project.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs
- Check the [Issues tab](https://github.com/Harshit-Maurya838/MailSync/issues) first to make sure your issue hasn't already been reported.
- If not, open a new issue describing:
  - Clear title and description of the bug.
  - Steps to reproduce.
  - Expected vs. actual behavior.
  - Runtime environment (Node.js version, OS, Docker / Vercel / Netlify).

### 2. Suggesting Features
- Open an issue labeled `enhancement`.
- Describe the feature, why it is needed, and how you imagine it working.

### 3. Submitting Code / Pull Requests
We love pull requests! Please follow the steps below:

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: v20.x or higher (Node 22 recommended)
- **npm**: v9.x or higher
- **Git**

### Step-by-Step

1. **Fork the repository** on GitHub by clicking the "Fork" button at [https://github.com/Harshit-Maurya838/MailSync](https://github.com/Harshit-Maurya838/MailSync).

2. **Clone your fork locally:**
   ```bash
   git clone https://github.com/<your-username>/MailSync.git
   cd MailSync
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Configure your test email credentials (e.g., a Gmail App Password) or leave blank if testing route validation.

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5000](http://localhost:5000) to view the live dashboard and test changes.

---

## 📂 Project Architecture

```
MailSync/
├── api/
│   └── index.js              # Vercel serverless function entrypoint
├── netlify/
│   └── functions/
│       └── api.js            # Netlify serverless handler (serverless-http)
├── core/
│   ├── auth.js               # API Key security middleware
│   ├── config.js             # Centralized environment variable manager
│   ├── logger.js             # Serverless-safe in-memory ring-buffer logger
│   ├── mailer.js             # Core Nodemailer transporter & HTML builder
│   └── serverInformation.js  # Server stats, uptime, and hit counters
├── pages/
│   └── index.html            # Developer dashboard, interactive tester & docs UI
├── public/
│   ├── favicon.svg           # MailSync favicon
│   └── logo.svg              # MailSync vector brand logo
├── Dockerfile                # Production container image
├── docker-compose.yml        # Docker compose recipe
├── netlify.toml              # Netlify build & redirect rules
├── vercel.json               # Vercel build & route rules
├── package.json              # Project dependencies & scripts
├── server.js                 # Main Express app and local runner
└── README.md                 # Project documentation
```

---

## 📝 Commit Convention

We follow standard [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description | Example |
|---|---|---|
| `feat:` | A new feature | `feat: add attachments support in /mail` |
| `fix:` | A bug fix | `fix: handle edge-case email regex format` |
| `docs:` | Documentation changes | `docs: add Vercel deployment guide` |
| `style:` | Code style / formatting (no logic change) | `style: reformat mailer.js with standard spacing` |
| `refactor:`| Code change that neither fixes a bug nor adds a feature | `refactor: optimize auth middleware` |
| `test:` | Adding or modifying tests | `test: add integration test for invalid recipient` |
| `chore:` | Build tasks, package updates, etc. | `chore: update dependencies` |

---

## 🚀 Pull Request Workflow

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Make your changes and test them locally:
   - Ensure the server starts without errors (`npm start` or `node server.js`).
   - Test endpoints using `curl` or the browser dashboard on `http://localhost:5000`.
   - Verify that no secrets or `.env` files are tracked in git.
3. Commit your changes:
   ```bash
   git add .
   git commit -m "feat: your concise commit message"
   ```
4. Push to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```
5. Open a Pull Request against the `main` branch of [Harshit-Maurya838/MailSync](https://github.com/Harshit-Maurya838/MailSync).
6. Fill in the PR description with:
   - What changed and why.
   - Screenshots if you modified the UI.
   - Any testing done.

---

## 📜 Licensing

By contributing to MailSync, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
