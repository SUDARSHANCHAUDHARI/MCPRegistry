import * as vscode from 'vscode'

const API_BASE = 'https://mcp-registry.com/api'

export function activate(context: vscode.ExtensionContext) {
  console.log('MCP Registry extension active')

  // Search command
  const searchCommand = vscode.commands.registerCommand('mcp-registry.search', async () => {
    const query = await vscode.window.showInputBox({
      prompt: 'Search MCP servers...',
      placeHolder: 'e.g., database, auth, api',
    })

    if (!query) return

    try {
      const response = await fetch(`${API_BASE}/servers?search=${encodeURIComponent(query)}`)
      const data = (await response.json()) as any

      const selectedServer = await vscode.window.showQuickPick(
        data.data.map((server: any) => ({
          label: `${server.name}`,
          description: server.description,
          server,
        })),
        { placeHolder: 'Select a server to view details' }
      )

      if (selectedServer) {
        showServerDetail(selectedServer.server)
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Search failed: ${error}`)
    }
  })

  // Open in browser
  const openCommand = vscode.commands.registerCommand('mcp-registry.open', () => {
    vscode.env.openExternal(vscode.Uri.parse('https://mcp-registry.com'))
  })

  // Trending command
  const trendingCommand = vscode.commands.registerCommand('mcp-registry.trending', async () => {
    try {
      const response = await fetch(`${API_BASE}/trending?limit=20`)
      const servers = (await response.json()) as any

      const selectedServer = await vscode.window.showQuickPick(
        servers.map((server: any) => ({
          label: `${server.name}`,
          description: `⭐ ${server.rating.toFixed(1)} (${server.rating_count} reviews)`,
          server,
        })),
        { placeHolder: 'Select a trending server' }
      )

      if (selectedServer) {
        showServerDetail(selectedServer.server)
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to fetch trending: ${error}`)
    }
  })

  context.subscriptions.push(searchCommand, openCommand, trendingCommand)
}

function showServerDetail(server: any) {
  const panel = vscode.window.createWebviewPanel(
    'mcpServerDetail',
    server.name,
    vscode.ViewColumn.Beside,
    { enableScripts: true }
  )

  panel.webview.html = getServerDetailHtml(server)
}

function getServerDetailHtml(server: any): string {
  const installCommand = server.install_command.replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto; padding: 20px; }
        h1 { margin: 0 0 10px 0; }
        .meta { color: #999; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { margin: 0 0 10px 0; color: #007acc; }
        .install { background: #1e1e1e; color: #d4d4d4; padding: 10px; border-radius: 4px; font-family: monospace; }
        button { background: #007acc; color: white; border: none; padding: 8px 16px; border-radius: 3px; cursor: pointer; }
        button:hover { background: #005a9e; }
        a { color: #007acc; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .badges { margin-bottom: 10px; }
        .badge { display: inline-block; background: #f0f0f0; padding: 4px 8px; border-radius: 3px; font-size: 12px; margin-right: 4px; }
      </style>
    </head>
    <body>
      <h1>${server.name}</h1>
      <div class="meta">
        ${server.verified ? '✓ Verified' : ''} | ⭐ ${server.github_stars} stars
      </div>

      <div class="section">
        <p>${server.description}</p>
      </div>

      <div class="section">
        <h3>Categories</h3>
        <div class="badges">
          ${server.category.map((cat: string) => `<span class="badge">${cat}</span>`).join('')}
        </div>
      </div>

      <div class="section">
        <h3>Install Command</h3>
        <div class="install">${installCommand}</div>
        <button onclick="copyToClipboard('${installCommand}')">Copy</button>
      </div>

      <div class="section">
        <a href="${server.github_url}" target="_blank">View on GitHub →</a>
      </div>

      <script>
        function copyToClipboard(text) {
          navigator.clipboard.writeText(text).then(() => {
            alert('Copied to clipboard!')
          })
        }
      </script>
    </body>
    </html>
  `
}

export function deactivate() {}
