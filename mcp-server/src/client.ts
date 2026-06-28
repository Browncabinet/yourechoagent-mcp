const DEFAULT_BASE = "https://dqovpwkmmtxqlrdvfuzz.supabase.co/functions/v1";
const HOSTED_MCP_URL = "https://dqovpwkmmtxqlrdvfuzz.supabase.co/functions/v1/mcp-http";

/**
 * Proxy a tool call to the hosted Streamable HTTP MCP endpoint.
 * Used by stdio-only tools (event discovery, comment drafts, etc.) so local
 * Claude Desktop / Cursor users get the same demo-tier capabilities without
 * needing their own Firecrawl / Lovable AI keys.
 */
export async function callHostedTool(name: string, args: unknown, apiKey?: string): Promise<unknown> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json, text/event-stream",
  };
  if (apiKey) headers["x-echo-api-key"] = apiKey;
  const res = await fetch(HOSTED_MCP_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: { name, arguments: args ?? {} },
    }),
  });
  const text = await res.text();
  // The hosted endpoint may stream SSE — extract the last `data:` JSON line if so.
  let payload: any = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("text/event-stream")) {
    const lines = text.split("\n").filter((l) => l.startsWith("data:"));
    const last = lines[lines.length - 1]?.slice(5).trim();
    try { payload = last ? JSON.parse(last) : null; } catch { payload = null; }
  } else {
    try { payload = JSON.parse(text); } catch { payload = { raw: text }; }
  }
  if (!res.ok) throw new Error(`Hosted MCP ${res.status}: ${text.slice(0, 200)}`);
  if (payload?.error) throw new Error(payload.error.message || "Hosted MCP error");
  // Return the tool's content array (array of {type,text}) or the raw result.
  return payload?.result ?? payload;
}

export class EchoClient {
  private base: string;
  private apiKey: string;

  constructor(apiKey: string, base?: string) {
    if (!apiKey) throw new Error("ECHO_API_KEY is required (get one at https://yourechoagent.com/for-agents/register)");
    if (!apiKey.startsWith("eak_")) throw new Error("ECHO_API_KEY must start with 'eak_'");
    this.apiKey = apiKey;
    this.base = (base || DEFAULT_BASE).replace(/\/$/, "");
  }

  private async req<T = unknown>(path: string, init: RequestInit = {}, query?: Record<string, string | undefined>): Promise<T> {
    const url = new URL(`${this.base}${path}`);
    if (query) for (const [k, v] of Object.entries(query)) if (v != null) url.searchParams.set(k, v);
    const res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    let data: any;
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }
    if (!res.ok) {
      const msg = data?.error || data?.message || res.statusText;
      throw new Error(`Echo API ${res.status}: ${msg}${data?.detail ? ` — ${data.detail}` : ""}`);
    }
    return data as T;
  }

  listAgents(params: { niche?: string; capability?: string } = {}) {
    return this.req("/a2a-agents-list", { method: "GET" }, params);
  }

  getAgent(agent_id: string) {
    return this.req("/a2a-agent-get", { method: "GET" }, { agent_id });
  }

  hire(body: Record<string, unknown>) {
    return this.req("/a2a-agent-hire", { method: "POST", body: JSON.stringify(body) });
  }

  getJob(job_id: string) {
    return this.req("/a2a-job-get", { method: "GET" }, { job_id });
  }

  controlJob(job_id: string, action: "pause" | "resume" | "cancel") {
    return this.req("/a2a-job-control", { method: "POST", body: JSON.stringify({ job_id, action }) });
  }

  rateJob(job_id: string, stars: number, feedback?: string) {
    return this.req("/a2a-job-rate", { method: "POST", body: JSON.stringify({ job_id, stars, feedback }) });
  }
}
