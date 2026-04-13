const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(payload)
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: corsHeaders,
      body: ""
    };
  }

  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { ok: false, error: "Method not allowed. Use POST." });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return jsonResponse(500, {
      ok: false,
      error: "Webhook is not configured. Set DISCORD_WEBHOOK_URL in Netlify environment variables."
    });
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch {
    return jsonResponse(400, { ok: false, error: "Invalid JSON body." });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const username = typeof body.username === "string" ? body.username.trim() : "";

  if (!message) {
    return jsonResponse(400, { ok: false, error: "Message is required." });
  }

  if (message.length > 1900) {
    return jsonResponse(400, {
      ok: false,
      error: "Message is too long. Keep it under 1900 characters."
    });
  }

  const discordPayload = {
    content: message
  };

  if (username) {
    discordPayload.username = username.slice(0, 80);
  }

  try {
    const discordRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload)
    });

    if (!discordRes.ok) {
      const discordText = await discordRes.text();
      return jsonResponse(502, {
        ok: false,
        error: "Discord rejected the message.",
        details: discordText.slice(0, 500)
      });
    }

    return jsonResponse(200, { ok: true, message: "Message sent to Discord." });
  } catch (error) {
    return jsonResponse(500, {
      ok: false,
      error: "Failed to contact Discord.",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
