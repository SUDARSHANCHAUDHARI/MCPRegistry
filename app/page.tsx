"use client";
import { useState } from "react";

const EXAMPLES = ["build a web scraper", "process payments", "send emails", "manage files", "query databases", "interact with GitHub"];
const STACKS = ["Node.js", "Python", "TypeScript", "Go", "Rust", "Any"];

interface MCPServer { name: string; description: string; category: string; installCommand: string; configExample: string; useCases: string[]; }
interface DiscoverResult { recommendations?: MCPServer[]; }

export default function MCPRegistryPage() {
  const [useCase, setUseCase] = useState("");
  const [stack, setStack] = useState("TypeScript");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function discover() {
    if (!useCase.trim()) return;
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/discover", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ useCase, stack }) });
      const data = await res.json();
      if (data.error) setError(data.error); else setResult(data as DiscoverResult);
    } catch (e) { setError(String(e)); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-400 mb-2">MCPRegistry</h1>
          <p className="text-slate-500">Discover the right MCP servers for your use case with install commands and config examples</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">What do you want to do?</label>
          <input className="w-full bg-[#111118] border border-green-900 rounded-lg px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-green-600" placeholder="Describe your use case..." value={useCase} onChange={(e) => setUseCase(e.target.value)} />
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLES.map((ex) => <button key={ex} onClick={() => setUseCase(ex)} className="px-3 py-1 bg-[#111118] border border-green-900/40 text-green-600 text-xs rounded-full hover:border-green-700 transition-colors">{ex}</button>)}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Stack</label>
          <div className="flex flex-wrap gap-2">{STACKS.map((s) => <button key={s} onClick={() => setStack(s)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${stack === s ? "bg-green-800 text-green-200 border border-green-600" : "bg-[#111118] text-slate-400 border border-slate-700 hover:border-green-900"}`}>{s}</button>)}</div>
        </div>
        <button onClick={discover} disabled={loading || !useCase.trim()} className="px-6 py-2 bg-green-700 hover:bg-green-600 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors mb-6">{loading ? "Discovering..." : "Find MCP Servers"}</button>
        {error && <div className="p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm mb-4">{error}</div>}
        {result?.recommendations && (
          <div className="space-y-3">
            <p className="text-slate-500 text-sm">{result.recommendations.length} MCP servers found</p>
            {result.recommendations.map((srv, i) => (
              <div key={i} className="bg-[#111118] border border-green-900/30 rounded-xl overflow-hidden">
                <div className="flex items-start justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === i ? null : i)}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-green-300 font-semibold">{srv.name}</h3>
                      <span className="px-2 py-0.5 bg-green-900/30 text-green-600 text-xs rounded-full">{srv.category}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{srv.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">{srv.useCases?.map((c, j) => <span key={j} className="px-2 py-0.5 bg-[#0d0d14] text-slate-500 text-xs rounded">{c}</span>)}</div>
                  </div>
                  <span className="text-slate-600 ml-4">{expanded === i ? "▲" : "▼"}</span>
                </div>
                {expanded === i && (
                  <div className="border-t border-green-900/30 p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Install</p>
                      <code className="block bg-[#0d0d14] text-green-400 text-xs p-3 rounded font-mono">{srv.installCommand}</code>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Config Example</p>
                      <pre className="bg-[#0d0d14] text-slate-300 text-xs p-3 rounded font-mono overflow-x-auto">{srv.configExample}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
