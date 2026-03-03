#!/usr/bin/env node
/// <reference types="node" />

// MCP Registry CLI
// Usage: npx mcp-registry-cli [command] [options]
// Note: This is a standalone CLI script, not compiled by Next.js

const API_BASE = process.env.MCP_REGISTRY_API || 'https://mcp-registry.com/api'

async function searchServers(query: string, category?: string, limit: string = '10') {
  try {
    const params = new URLSearchParams({
      search: query || '',
      category: category || '',
      limit,
    })

    const response = await fetch(`${API_BASE}/servers?${params}`)
    const data = await response.json() as any

    if (!data.data || data.data.length === 0) {
      console.log('❌ No servers found')
      return
    }

    console.log('\n📋 Search Results:\n')
    data.data.forEach((server: any, i: number) => {
      console.log(`${i + 1}. ${server.name}`)
      console.log(`   ${server.description}`)
      console.log(`   ⭐ ${server.github_stars} stars | Category: ${server.category.join(', ')}`)
      console.log()
    })

    console.log(`Found ${data.total} results`)
  } catch (error) {
    console.error('Error searching servers:', error)
    process.exit(1)
  }
}

async function getServerInfo(serverId: string) {
  try {
    const response = await fetch(`${API_BASE}/servers/${serverId}`)
    if (!response.ok) throw new Error('Server not found')

    const server = await response.json() as any

    console.log(`\n🔌 ${server.name}\n`)
    console.log(`${server.description}\n`)
    console.log(`📊 Stats:`)
    console.log(`  Stars: ${server.github_stars}`)
    console.log(`  Category: ${server.category.join(', ')}`)
    console.log(`  Status: ${server.status}`)
    console.log(`\n📦 Install:`)
    console.log(`  ${server.install_command}`)
    console.log(`\n🔗 GitHub: ${server.github_url}`)
  } catch (error) {
    console.error('Error fetching server:', error)
    process.exit(1)
  }
}

async function getTrendingServers(limit: string = '10') {
  try {
    const response = await fetch(`${API_BASE}/trending?limit=${limit}`)
    const data = await response.json() as any

    console.log('\n🔥 Trending Servers\n')
    data.forEach((server: any, i: number) => {
      console.log(`${i + 1}. ${server.name}`)
      console.log(`   Rating: ${'⭐'.repeat(Math.round(server.rating))} (${server.rating.toFixed(1)})`)
      console.log(`   Reviews: ${server.rating_count}`)
      console.log()
    })
  } catch (error) {
    console.error('Error fetching trending:', error)
    process.exit(1)
  }
}

async function getRegistryStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`)
    const stats = await response.json() as any

    console.log('\n📊 Registry Statistics\n')
    console.log(`Total Servers: ${stats.total_servers}`)
    console.log(`Categories: ${stats.total_categories}`)
    console.log(`\nCategories:`)
    stats.categories.forEach((cat: string) => {
      console.log(`  • ${cat}`)
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    process.exit(1)
  }
}

// CLI router
const command = process.argv[2]
const arg1 = process.argv[3]
const arg2 = process.argv[4]

if (!command) {
  console.log('🔌 MCP Registry CLI v1.0.0')
  console.log('\nUsage: mcp-registry [command] [options]\n')
  console.log('Commands:')
  console.log('  search <query>     - Search for MCP servers')
  console.log('  info <serverId>    - Get server details')
  console.log('  trending           - Show trending servers')
  console.log('  stats              - Show registry statistics')
  console.log('\nExamples:')
  console.log('  mcp-registry search claude')
  console.log('  mcp-registry trending')
  console.log('  mcp-registry stats')
  process.exit(0)
}

switch (command) {
  case 'search':
    if (!arg1) {
      console.error('❌ Please provide a search query')
      process.exit(1)
    }
    searchServers(arg1, arg2)
    break

  case 'info':
    if (!arg1) {
      console.error('❌ Please provide a server ID')
      process.exit(1)
    }
    getServerInfo(arg1)
    break

  case 'trending':
    getTrendingServers(arg1 || '10')
    break

  case 'stats':
    getRegistryStats()
    break

  default:
    console.error(`❌ Unknown command: ${command}`)
    console.error('Use "mcp-registry" with no arguments for help')
    process.exit(1)
}

