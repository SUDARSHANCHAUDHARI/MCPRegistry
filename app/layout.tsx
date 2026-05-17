import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "MCPRegistry", description: "Discover MCP servers for your use case" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body className="bg-[#0a0a0f] antialiased">{children}</body></html>;
}
