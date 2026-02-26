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

    // Forward request to n8n webhook
    const n8nResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload || {}),
    });

    const data = await n8nResponse.json().catch(() => ({ status: "triggered" }));

    return new Response(JSON.stringify({ agent, data }), {
      status: n8nResponse.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
