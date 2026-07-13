import Anthropic from "@anthropic-ai/sdk";
import { guard, safeError, extractText, safeJson } from "../../../lib/apiGuard";
import { NextRequest, NextResponse } from "next/server";
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
export async function POST(req: NextRequest) {
  const _guard = guard(req);
  if (_guard) return _guard;
  const { useCase, stack, requirements } = await req.json();
  if (!useCase?.trim()) return NextResponse.json({ error: "Use case required" }, { status: 400 });
  const prompt = `You are an MCP (Model Context Protocol) expert. Recommend the best MCP servers for this use case.
Use case: ${useCase} | Stack: ${stack || "Any"} | Requirements: ${requirements || "None"}
Return JSON: { "recommendations": [{ "name": "string", "description": "string", "category": "string", "installCommand": "string", "configExample": "string", "useCases": ["string"], "rating": 0-100, "officialUrl": "string" }], "architecture": "string", "quickStartSteps": ["string"], "caveats": ["string"], "alternatives": ["string"], "summary": "string" }
Return ONLY valid JSON.`;
  try {
    const msg = await client.messages.create({ model: "claude-sonnet-4-6", max_tokens: 1500, messages: [{ role: "user", content: prompt }] });
    return NextResponse.json(safeJson(extractText(msg)));
  } catch (e) { return safeError(e); }
}
