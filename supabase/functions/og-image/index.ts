import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from "https://deno.land/x/og_edge@0.0.6/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const e = React.createElement;

function OGImage() {
  const tags = ["Scalable", "Compliant", "Enterprise-Ready"];

  return e("div", {
    style: {
      width: "1200px",
      height: "630px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)",
      fontFamily: "Space Grotesk",
      position: "relative",
    },
  },
    // Top accent line
    e("div", {
      style: {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        height: "4px",
        background: "linear-gradient(90deg, transparent, #b48246, transparent)",
      },
    }),
    // Bronze glow top-right
    e("div", {
      style: {
        position: "absolute",
        top: "-80px",
        right: "-80px",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,130,70,0.25) 0%, transparent 70%)",
      },
    }),
    // Bronze glow bottom-left
    e("div", {
      style: {
        position: "absolute",
        bottom: "-60px",
        left: "-60px",
        width: "250px",
        height: "250px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(180,130,70,0.15) 0%, transparent 70%)",
      },
    }),
    // Content wrapper
    e("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "24px",
        zIndex: 1,
      },
    },
      // Brand mark
      e("div", { style: { display: "flex", alignItems: "center", gap: "12px" } },
        e("div", {
          style: {
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #b48246, #8a6235)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "24px",
            fontWeight: 700,
          },
        }, "A"),
        e("div", {
          style: {
            color: "#b48246",
            fontSize: "28px",
            fontWeight: 700,
            letterSpacing: "2px",
          },
        }, "AGENTIC SCRAPE"),
      ),
      // Headline
      e("div", {
        style: {
          color: "#ffffff",
          fontSize: "56px",
          fontWeight: 700,
          textAlign: "center",
          lineHeight: 1.15,
          maxWidth: "900px",
          padding: "0 40px",
        },
      }, "AI-Powered Web Intelligence Platform"),
      // Subtitle
      e("div", {
        style: {
          color: "#a0a0a0",
          fontSize: "24px",
          fontWeight: 400,
          textAlign: "center",
          maxWidth: "700px",
        },
      }, "Autonomous agents that extract, monitor, and structure web data at enterprise scale"),
      // Tags row
      e("div", { style: { display: "flex", gap: "16px", marginTop: "12px" } },
        ...tags.map((tag) =>
          e("div", {
            key: tag,
            style: {
              color: "#b48246",
              fontSize: "16px",
              fontWeight: 600,
              border: "1px solid rgba(180,130,70,0.4)",
              borderRadius: "20px",
              padding: "6px 20px",
            },
          }, tag)
        ),
      ),
    ),
  );
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const fontResponse = await fetch(
      "https://cdn.jsdelivr.net/fontsource/fonts/space-grotesk@latest/latin-700-normal.woff"
    );
    const fontData = await fontResponse.arrayBuffer();

    return new ImageResponse(e(OGImage, null), {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          weight: 700,
          style: "normal" as const,
        },
      ],
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.error("OG image generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
