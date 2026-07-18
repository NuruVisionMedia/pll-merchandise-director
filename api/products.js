/*
==========================================
PLL SHOPIFY PRODUCTS API
Client Credentials Authentication
==========================================
*/

let cachedAccessToken = null;
let tokenExpiresAt = 0;

function normalizeStoreDomain(domain) {
    return domain
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
}

async function getAccessToken(storeDomain, clientId, clientSecret) {
    if (
        cachedAccessToken &&
        Date.now() < tokenExpiresAt - 60_000
    ) {
        return cachedAccessToken;
    }

    const tokenResponse = await fetch(
        `https://${storeDomain}/admin/oauth/access_token`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
                client_id: clientId,
                client_secret: clientSecret
            })
        }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
        throw new Error(
            tokenData.error_description ||
            tokenData.error ||
            `Shopify token request failed (${tokenResponse.status}).`
        );
    }

    cachedAccessToken = tokenData.access_token;
    tokenExpiresAt =
        Date.now() + Number(tokenData.expires_in || 86399) * 1000;

    return cachedAccessToken;
}

export default async function handler(request, response) {
    if (request.method !== "GET") {
        response.setHeader("Allow", "GET");

        return response.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    const storeDomainValue =
        process.env.SHOPIFY_STORE_DOMAIN;

    const clientId =
        process.env.SHOPIFY_API_KEY;

    const clientSecret =
        process.env.SHOPIFY_API_SECRET;

    const apiVersion =
        process.env.SHOPIFY_API_VERSION || "2026-07";

    if (!storeDomainValue || !clientId || !clientSecret) {
        return response.status(500).json({
            success: false,
            message:
                "Shopify store domain, API key, or API secret is missing in Vercel."
        });
    }

    const storeDomain =
        normalizeStoreDomain(storeDomainValue);

    const query = `
        query GetProducts {
            products(first: 100) {
                nodes {
                    id
                    title
                    handle
                    status
                    vendor
                    productType
                    descriptionHtml
                    totalInventory

                    seo {
                        title
                        description
                    }

                    featuredMedia {
                        preview {
                            image {
                                url
                                altText
                            }
                        }
                    }

                    variants(first: 25) {
                        nodes {
                            id
                            title
                            sku
                            price
                            inventoryQuantity

                            inventoryItem {
                                unitCost {
                                    amount
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const accessToken = await getAccessToken(
            storeDomain,
            clientId,
            clientSecret
        );

        const shopifyResponse = await fetch(
            `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken
                },
                body: JSON.stringify({ query })
            }
        );

        const result = await shopifyResponse.json();

        if (
            !shopifyResponse.ok ||
            Array.isArray(result.errors)
        ) {
            return response.status(502).json({
                success: false,
                message:
                    "Shopify product retrieval failed.",
                errors: result.errors || result
            });
        }

        const products =
            result?.data?.products?.nodes || [];

        return response.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error(
            "Shopify products API error:",
            error
        );

        return response.status(500).json({
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unknown Shopify error occurred."
        });
    }
}
