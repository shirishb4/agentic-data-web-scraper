const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WEBHOOK_KEYS: Record<string, string> = {
  youtube: "N8N_YOUTUBE_WEBHOOK_URL",
  google: "N8N_GOOGLE_WEBHOOK_URL",
  tripadvisor: "N8N_TRIPADVISOR_WEBHOOK_URL",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { agent, payload } = await req.json();

    if (!agent || !WEBHOOK_KEYS[agent]) {
      return new Response(
        JSON.stringify({
          error: "Invalid agent. Use: youtube, google, or tripadvisor",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const webhookUrl = Deno.env.get(WEBHOOK_KEYS[agent]);

    if (!webhookUrl) {
      return new Response(
        JSON.stringify({
          error: `Webhook URL not configured for ${agent}. Set the ${WEBHOOK_KEYS[agent]} secret.`,
          status: "not_configured",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build a payload compatible with both standard Webhook and Chat Trigger nodes.
    // n8n's "When chat message received" trigger expects: { chatInput, sessionId, action: "sendMessage" }
    const incoming = (payload ?? {}) as Record<string, unknown>;
    const userMessage =
      (incoming.chatInput as string | undefined) ??
      (incoming.message as string | undefined) ??
      (incoming.url as string | undefined) ??
      (incoming.query as string | undefined) ??
      "";

    const isChatEndpoint = webhookUrl.endsWith("/chat") || webhookUrl.includes("/chat?");

    const body = isChatEndpoint
      ? {
          action: "sendMessage",
          sessionId:
            (incoming.sessionId as string | undefined) ??
            `agentic-scrape-${crypto.randomUUID()}`,
          chatInput: userMessage,
          ...incoming,
        }
      : { ...incoming, chatInput: userMessage, message: userMessage };

    console.log(`[scraper-webhook] ${agent} -> ${webhookUrl} (chat=${isChatEndpoint})`);

    // n8n AI agents can take 30s+ to respond. Allow up to 90s.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90_000);
    let n8nResponse: Response;
    try {
      n8nResponse = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timeout);
      const msg = e instanceof Error ? e.message : String(e);
      return new Response(
        JSON.stringify({
          agent,
          error: "Failed to reach n8n",
          hint: msg.includes("abort")
            ? "n8n took longer than 90s to respond. Check the workflow execution in n8n."
            : "Verify the webhook URL is reachable and the workflow is Active.",
          detail: msg,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    clearTimeout(timeout);

    const rawText = await n8nResponse.text();
    let data: unknown;
    try {
      data = rawText ? JSON.parse(rawText) : { status: "triggered" };
    } catch {
      data = { status: "triggered", raw: rawText };
    }

    if (!n8nResponse.ok) {
      return new Response(
        JSON.stringify({
          agent,
          error: `n8n responded with ${n8nResponse.status}`,
          hint:
            n8nResponse.status === 404
              ? "The webhook URL is wrong or the n8n workflow is not Active. Use the Production URL from the Webhook/Chat Trigger node (format: /webhook/<uuid> or /webhook/<uuid>/chat), not the workflow editor URL."
              : undefined,
          n8nResponse: data,
        }),
        {
          status: 200, // return 200 so the client can read the body cleanly
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ agent, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
