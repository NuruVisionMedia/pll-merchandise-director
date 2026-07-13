/*
==========================================
PLL MERCHANDISE DIRECTOR
Shopify OAuth Callback
==========================================
*/

export default async function handler(req, res) {

    const shop = req.query.shop;

    if (!shop) {
        return res.status(400).send("Missing shop.");
    }

    const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!token) {
        return res.status(500).send("Admin API token not configured.");
    }

    res.setHeader(
        "Set-Cookie",
        [
            `pll_shop=${shop}; Path=/; HttpOnly; Secure; SameSite=Lax`,
            `pll_connected=true; Path=/; HttpOnly; Secure; SameSite=Lax`
        ]
    );

    return res.redirect("/");
}
