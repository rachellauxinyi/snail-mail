import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

/** Pending delivery keys — prefix must avoid `_` before `%` in SQL LIKE (underscore is wildcard). */
const PENDING_PREFIX = "pd:";

async function runProcessDeliveries(): Promise<{
  processed: number;
  errors: number;
  timestamp: string;
}> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  const allPending = await kv.getByPrefix(PENDING_PREFIX);
  const now = new Date();

  const pendingLetters = allPending.filter((pending) => {
    const deliveryDate = new Date(pending.deliveryDate);
    return deliveryDate <= now;
  });

  let processed = 0;
  let errors = 0;

  for (const pending of pendingLetters) {
    try {
      const letter = await kv.get(pending.letterId);

      if (!letter || letter.delivered) {
        continue;
      }

      const recipientEmail = pending.recipientEmail || letter.recipientEmail;

      if (!recipientEmail) {
        console.log(`No recipient email found for letter ${pending.letterId}`);
        errors++;
        continue;
      }

      const viewUrl =
        `https://venue-sienna-69575773.figma.site#/view/${letter.letterId}`;

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Snail Mail <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: "📬 Your letter has arrived!",
          html: `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F7F4F0;">
                <div style="background-color: #FEFDFB; border: 2px solid #D4CFC5; padding: 40px; box-shadow: 4px 4px 0px 0px rgba(139,115,85,0.1);">
                  <h1 style="color: #3E3831; font-size: 32px; text-align: center; margin-bottom: 20px; letter-spacing: 0.05em;">
                    📬 snail mail
                  </h1>
                  <p style="color: #6B6256; text-align: center; font-style: italic; margin-bottom: 30px; font-size: 18px;">
                    Your letter has arrived!
                  </p>

                  <div style="text-align: center; margin: 40px 0;">
                    <div style="font-size: 80px; margin-bottom: 20px;">💌</div>
                    <p style="color: #3E3831; font-size: 18px; margin-bottom: 10px;">
                      Dear ${letter.recipientName || "Friend"},
                    </p>
                    <p style="color: #6B6256; line-height: 1.8; margin-bottom: 30px;">
                      Someone special has sent you a heartfelt letter! 💕
                    </p>
                    <p style="color: #8B7355; font-style: italic; margin-bottom: 30px;">
                      Click below to watch it arrive and read your message...
                    </p>
                  </div>

                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${viewUrl}" style="display: inline-block; background-color: #8B7355; color: #FEFDFB; padding: 16px 40px; text-decoration: none; font-size: 20px; border: 2px solid #8B7355; font-family: 'Instrument Serif', Georgia, serif; letter-spacing: 0.05em; box-shadow: 4px 4px 0px rgba(139,115,85,0.3);">
                      Open Your Letter
                    </a>
                  </div>

                  <div style="background-color: #E8E3DC; border: 2px solid #6B8E7F; padding: 20px; margin-top: 30px; text-align: center;">
                    <p style="color: #3E3831; margin: 0; font-size: 14px;">
                      📮 <strong>Delivered with care</strong>
                    </p>
                  </div>
                </div>
                <p style="text-align: center; color: #8B7355; font-size: 12px; margin-top: 20px; font-style: italic;">
                  Sent with love via Snail Mail
                </p>
              </div>
            `,
        }),
      });

      if (response.ok) {
        await kv.set(letter.letterId, {
          ...letter,
          delivered: true,
          deliveredAt: new Date().toISOString(),
        });
        const deliveryDateStr = new Date(letter.deliveryDate).toISOString().split("T")[0];
        await kv.del(`${PENDING_PREFIX}${deliveryDateStr}:${letter.letterId}`);
        processed++;
        console.log(`Delivered letter ${letter.letterId} to ${pending.recipientEmail}`);
      } else {
        errors++;
        console.log(`Failed to deliver letter ${letter.letterId}:`, await response.text());
      }
    } catch (err) {
      errors++;
      console.log(`Error processing letter ${pending.letterId}:`, err);
    }
  }

  return { processed, errors, timestamp: now.toISOString() };
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-4ba6ddf6/health", (c) => {
  return c.json({ status: "ok" });
});

// Send email notification endpoint
app.post("/make-server-4ba6ddf6/send-email", async (c) => {
  try {
    const { recipientEmail, recipientName, letterData } = await c.req.json();

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return c.json({ error: 'Invalid email address' }, 400);
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.log('Error: RESEND_API_KEY environment variable is not set');
      return c.json({ error: 'Email service not configured' }, 500);
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Snail Mail <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: '💌 You have mail on the way!',
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #F7F4F0;">
            <div style="background-color: #FEFDFB; border: 2px solid #D4CFC5; padding: 40px; box-shadow: 4px 4px 0px 0px rgba(139,115,85,0.1);">
              <h1 style="color: #3E3831; font-size: 32px; text-align: center; margin-bottom: 20px; letter-spacing: 0.05em;">
                📬 snail mail
              </h1>
              <p style="color: #6B6256; text-align: center; font-style: italic; margin-bottom: 30px;">
                Someone special has sent you a letter!
              </p>
              <div style="border-top: 2px dashed #D4CFC5; padding-top: 30px; margin-top: 30px;">
                <p style="color: #3E3831; font-size: 18px; margin-bottom: 15px;">
                  Dear ${recipientName || 'Friend'},
                </p>
                <p style="color: #6B6256; line-height: 1.8; margin-bottom: 20px;">
                  A heartfelt letter is on its way to you! 💌
                </p>
                <p style="color: #6B6256; line-height: 1.8; margin-bottom: 20px;">
                  Someone took the time to craft a personalized message just for you. Keep an eye on your mailbox - something special is coming!
                </p>
                <div style="background-color: #E8E3DC; border: 2px solid #6B8E7F; padding: 20px; margin-top: 30px; text-align: center;">
                  <p style="color: #3E3831; margin: 0; font-size: 14px;">
                    📮 <strong>Average delivery time: 30 seconds (testing mode)</strong>
                  </p>
                </div>
              </div>
            </div>
            <p style="text-align: center; color: #8B7355; font-size: 12px; margin-top: 20px; font-style: italic;">
              Sent with love via Snail Mail
            </p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.log(`Resend API error while sending email: ${response.status} - ${errorData}`);
      return c.json({ error: `Failed to send email: ${errorData}` }, response.status);
    }

    const result = await response.json();
    console.log('Email sent successfully:', result);

    // Generate unique letter ID and store letter data
    const letterId = `letter_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // For testing: deliver in 30 seconds instead of 3 days
    const deliveryDate = new Date(Date.now() + 30 * 1000); // 30 seconds from now
    // For production: const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now

    await kv.set(letterId, {
      ...letterData,
      letterId,
      sentDate: new Date().toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      delivered: false
    });

    // Store pending row for cron + background delivery scan (LIKE-safe key; no underscores in prefix literal)
    const deliveryDateStr = deliveryDate.toISOString().split("T")[0];
    const pendingKey = `${PENDING_PREFIX}${deliveryDateStr}:${letterId}`;
    await kv.set(pendingKey, { letterId, recipientEmail, deliveryDate: deliveryDate.toISOString() });

    console.log(`Letter stored with ID: ${letterId}, scheduled for delivery on ${deliveryDate.toISOString()}`);

    const edgeRt = (globalThis as Record<string, { waitUntil(p: Promise<unknown>): void }>)
      ["EdgeRuntime"];
    edgeRt?.waitUntil?.(
      (async () => {
        await new Promise((r) => setTimeout(r, 31_000));
        try {
          const out = await runProcessDeliveries();
          console.log("Background process-deliveries:", out);
        } catch (e) {
          console.log("Background process-deliveries error:", e);
        }
      })(),
    );

    return c.json({ success: true, emailId: result.id, letterId });
  } catch (error) {
    console.log(`Server error while sending email: ${error}`);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Get letter data for viewing
app.get("/make-server-4ba6ddf6/letter/:letterId", async (c) => {
  try {
    const letterId = c.req.param('letterId');
    const letter = await kv.get(letterId);

    if (!letter) {
      return c.json({ error: 'Letter not found' }, 404);
    }

    // Check if letter has been delivered
    if (!letter.delivered) {
      return c.json({ error: 'Letter not yet delivered' }, 403);
    }

    return c.json({ letter });
  } catch (error) {
    console.log(`Error fetching letter: ${error}`);
    return c.json({ error: `Server error: ${error.message}` }, 500);
  }
});

// Process pending deliveries (cron fallback; sends also scheduled via EdgeRuntime.waitUntil after send-email)
app.post("/make-server-4ba6ddf6/process-deliveries", async (c) => {
  try {
    const result = await runProcessDeliveries();
    return c.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(`Error processing deliveries: ${error}`);
    return c.json({ error: `Server error: ${message}` }, 500);
  }
});

Deno.serve(app.fetch);