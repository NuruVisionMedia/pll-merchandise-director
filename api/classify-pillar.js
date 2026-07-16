/*
==========================================
PLL MERCHANDISE DIRECTOR
AI Pillar Classification
Uses Claude to classify a product into TRAIN, FUEL, or FOCUS
==========================================
*/

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        return res.status(500).json({
            success: false,
            message: "ANTHROPIC_API_KEY is not configured in Vercel."
        });
    }

    const { title, productType, description } = req.body || {};

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Product title is required."
        });
    }

    const systemPrompt = `You are the Product Research Agent for Prime Level Living (PLL), a fitness and performance lifestyle brand.

PLL organizes every product into exactly one of three pillars:
- TRAIN: fitness equipment, workout gear, apparel, recovery tools
- FUEL: nutrition, supplements, food, hydration, kitchen/cooking products used for healthy eating
- FOCUS: mindset, sleep, journaling, meditation, mental performance, home/lifestyle ambiance

Given a product's title, product type, and description, classify it into exactly one pillar using your best judgment.

Respond with ONLY a JSON object, no other text, no markdown formatting:
{"pillar": "TRAIN" | "FUEL" | "FOCUS", "reasoning": "one short sentence"}`;

    const userMessage = `Title: ${title}
Product Type: ${productType || "Not specified"}
Description: ${description ? description.slice(0, 500) : "Not provided"}`;

    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01"
            },
            body: JSON.stringify({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 200,
                system: systemPrompt,
                messages: [
                    { role: "user", content: userMessage }
                ]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(502).json({
                success: false,
                message: "Claude classification request failed.",
                errors: data
            });
        }

        const rawText = (data.content || [])
            .map(block => block.text || "")
            .join("")
            .trim();

        const cleaned = rawText
            .replace(/^```json/i, "")
            .replace(/^```/, "")
            .replace(/```$/, "")
            .trim();

        let parsed;

        try {
            parsed = JSON.parse(cleaned);
        } catch (parseError) {
            return res.status(502).json({
                success: false,
                message: "Could not parse Claude's classification response.",
                raw: rawText
            });
        }

        const validPillars = ["TRAIN", "FUEL", "FOCUS"];

        if (!validPillars.includes(parsed.pillar)) {
            return res.status(502).json({
                success: false,
                message: "Claude returned an unrecognized pillar.",
                raw: rawText
            });
        }

        return res.status(200).json({
            success: true,
            pillar: parsed.pillar,
            reasoning: parsed.reasoning || ""
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
