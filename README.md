# MCPRegistry 🔌🤖

**Discover the right MCP servers for your use case — AI-matched install commands, config examples, and capability lists, tailored to your stack.**

Describe what you want to do (e.g. "send emails", "query databases", "interact with GitHub"), pick your stack, and get a curated list of matching MCP servers with install commands, JSON config examples, and capability tags — ready to drop into your Claude or AI agent setup.

---

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
