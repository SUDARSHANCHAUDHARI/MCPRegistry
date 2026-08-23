# MCPRegistry 🔌🤖

**Discover the right MCP servers for your use case — AI-matched install commands, config examples, and capability lists, tailored to your stack.**

Describe what you want to do (e.g. "send emails", "query databases", "interact with GitHub"), pick your stack, and get a curated list of matching MCP servers with install commands, JSON config examples, and capability tags — ready to drop into your Claude or AI agent setup.

---

## Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#-architecture)
- [🖥️ UI Overview](#-ui-overview)
- [🚀 Getting Started](#-getting-started)
- [📜 Scripts](#-scripts)
- [🔑 Environment Variables](#-environment-variables)
- [📊 Current Status](#-current-status)
- [🛠️ Tech Stack](#-tech-stack)
- [🔒 Security](#-security)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)
- [📞 Support](#-support)
- [About](#about)

## 🌟 Features

### 🔌 Core Features
- ✅ **Use Case Input** — describe what you want your AI agent to do
- ✅ **Example Chips** — quick-fill: build a web scraper, process payments, send emails, manage files, query databases, interact with GitHub
- ✅ **Stack Selector** — Node.js, Python, TypeScript, Go, Rust, Any
- ✅ **Server Cards** — name, category, description, capabilities list
- ✅ **Expandable Detail** — click to reveal install command and config example
- ✅ **Install Command** — monospace code block, ready to copy
- ✅ **Config Example** — JSON config snippet for Claude Desktop or agent setup
- ✅ **Capabilities Tags** — what each server can actually do

### 🤖 AI Features
- ✅ **Claude Sonnet 4.6** — matches use cases to MCP servers from its training knowledge
- ✅ **Stack-aware recommendations** — Node.js vs Python vs Go installs differ
- ✅ **Use-case ranking** — most relevant servers listed first
- ✅ **Config generation** — produces working claude_desktop_config.json snippets

### ⚙️ Technical Features
- ✅ **Next.js 15 App Router** — server + client components
- ✅ **TypeScript strict mode** — fully typed server and result interfaces
- ✅ **Tailwind CSS** — dark green theme with expandable accordion cards

---

## 🏗️ Architecture

```
MCPRegistry/
├── 📁 app/
│   ├── 📄 page.tsx          # Main UI — use case input + MCP server results
│   ├── 📄 layout.tsx        # Root layout with dark background
│   ├── 📄 globals.css       # Global styles
│   └── 📁 api/
│       └── 📁 discover/
│           └── 📄 route.ts  # POST /api/discover — Claude MCP server matcher
├── 📁 public/               # Static assets
├── 📄 .env.example          # Environment variable template
├── 📄 package.json
└── 📄 README.md
```

---

## 🖥️ UI Overview

| Section | Description |
|---|---|
| **Use Case Input** | Describe what you want your agent to do |
| **Example Chips** | Quick-fill common use cases |
| **Stack Chips** | Node.js / Python / TypeScript / Go / Rust / Any |
| **Find MCP Servers** | Triggers Claude discovery |
| **Result Count** | "N MCP servers found" |
| **Server Card Header** | Name + category badge + description + capability tags |
| **Expanded Detail** | Install command (monospace) + JSON config example |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm
- Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SUDARSHANCHAUDHARI/MCPRegistry.git
   cd MCPRegistry
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your ANTHROPIC_API_KEY
   ```

4. **Run dev server**
   ```bash
   pnpm dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## 📜 Scripts

```bash
pnpm dev      # Start development server (Turbopack)
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # ESLint check
```

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key | ✅ Yes |

Get your key at [console.anthropic.com](https://console.anthropic.com). Add it to `.env.local` — this file is gitignored and never committed.

---

## 📊 Current Status

| Property | Value |
|---|---|
| **Version** | 1.0.0 |
| **Status** | ✅ MVP Complete |
| **Model** | claude-sonnet-4-6 |
| **Stacks** | 6 (Node.js, Python, TypeScript, Go, Rust, Any) |
| **Example Use Cases** | 6 |

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript (strict mode) |
| **Styling** | Tailwind CSS |
| **AI** | Claude API — claude-sonnet-4-6 |
| **Package Manager** | pnpm |

---

## 🔒 Security

- `ANTHROPIC_API_KEY` lives in `.env.local` — gitignored, never committed
- `.env.example` contains placeholder values only
- API key sent directly to Anthropic — no intermediate server
- Use case input not stored or logged server-side

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/SUDARSHANCHAUDHARI/MCPRegistry/issues)

---

<div align="center">

**Made with ❤️ by [SUDARSHANCHAUDHARI](https://github.com/SUDARSHANCHAUDHARI)**

[⭐ Star this repo](https://github.com/SUDARSHANCHAUDHARI/MCPRegistry) · [🐛 Report Issue](https://github.com/SUDARSHANCHAUDHARI/MCPRegistry/issues)

</div>

---

## About

I'm Sudarshan Chaudhari, a Senior Quality Engineer, Test Automation specialist, and AI systems builder based in Bangkok, Thailand.

I have 13+ years of experience in software quality engineering, working across SaaS, fintech, gaming, web, mobile, cloud, and digital signage platforms. My background combines hands-on test automation with QA leadership, test strategy, CI/CD, release quality, production investigation, and cross-platform validation.

Alongside my professional QA career, I run [SudarshanTechLabs](https://sudarshantechlabs.com/), my independent engineering and product lab where I design, build, test, and ship software across Android, web, AI, cybersecurity, developer tooling, and cross-platform applications.

### What I work on

- ⚙️ **Quality Engineering & Test Automation** — Playwright, Selenium, Cypress, Appium, API testing, automation frameworks, end-to-end testing, CI/CD, release gates, GitHub Actions, risk-based testing, and production validation
- 🤖 **AI Systems & Automation** — AI agents, multi-agent orchestration, MCP servers, AI-assisted QA, prompt tooling, developer workflows, automation systems, and Claude Code plugins
- 📱 **Mobile & Cross-Platform Applications** — Android applications built with Kotlin and Jetpack Compose, Google Play releases, automated build and publishing pipelines, and cross-platform development spanning iOS, web, Windows, and macOS
- 🌐 **Web Applications & Platforms** — Full-stack applications using Next.js, TypeScript, Firebase, Cloudflare, REST APIs, and modern web infrastructure
- 🛠️ **Developer Tooling & CLI Engineering** — Rust, Python, TypeScript, CLI utilities, multi-repository tooling, build automation, release tooling, and engineering productivity systems
- 🛡️ **Cybersecurity & Observability** — Threat detection, log analysis, security auditing, vulnerability assessment, monitoring, and security-focused developer tools
- 📺 **Digital Signage & Device Platforms** — Content validation, playback testing, device compatibility, production investigation, monitoring, and QA across diverse hardware and operating-system environments

My work sits at the intersection of quality engineering, automation, AI, and software development. I approach products with a QA mindset from the beginning: understanding failure modes, designing for testability, automating repetitive work, and building release confidence into the engineering process.

Through SudarshanTechLabs, I also build products and tools from idea to production, covering architecture, development, testing, CI/CD, release automation, monitoring, and ongoing maintenance.

🌐 [sudarshantechlabs.com](https://sudarshantechlabs.com/) · 💼 [LinkedIn](https://linkedin.com/in/sudarshan-chaudhari) · 🐙 [GitHub](https://github.com/SUDARSHANCHAUDHARI) · ✉️ [sunny.sudarshan@gmail.com](mailto:sunny.sudarshan@gmail.com)
