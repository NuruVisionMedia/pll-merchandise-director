/*
==========================================
PLL MERCHANDISE DIRECTOR
Shopify Product Write-Back
Creates a real product in Shopify from an approved queue item
==========================================
*/

function normalizeStoreDomain(domain) {
    return domain
        .trim()
        .replace(/^https?:\/\//, "")
        .replace(/\/+$/, "");
}

async function getAccessToken(storeDomain, clientId, clientSecret) {
    const tokenResponse = await fetch(
        `https://${storeDomain}/admin/oauth/access_token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
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

    return tokenData.access_token;
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    const storeDomainValue = process.env.SHOPIFY_STORE_DOMAIN;
    const clientId = process.env.SHOPIFY_API_KEY;
    const clientSecret = process.env.SHOPIFY_API_SECRET;
    const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

    if (!storeDomainValue || !clientId || !clientSecret) {
        return res.status(500).json({
            success: false,
            message: "Shopify credentials are not configured in Vercel."
        });
    }

    const storeDomain = normalizeStoreDomain(storeDomainValue);

    const {
        title,
        pillar,
        descriptionHtml,
        seoTitle,
        seoDescription,
        price
    } = req.body || {};

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Product title is required."
        });
    }

    try {
        const accessToken = await getAccessToken(storeDomain, clientId, clientSecret);

        const endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

        const createMutation = `
            mutation productCreate($input: ProductInput!) {
                productCreate(input: $input) {
                    product {
                        id
                        title
                        status
                        variants(first: 1) {
                            edges {
                                node {
                                    id
                                    price
                                }
                            }
                        }
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const createResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken
            },
            body: JSON.stringify({
                query: createMutation,
                variables: {
                    input: {
                        title,
                        productType: pillar || "",
                        descriptionHtml: descriptionHtml || "",
                        status: "DRAFT",
                        seo: {
                            title: seoTitle || title,
                            description: seoDescription || ""
                        }
                    }
                }
            })
        });

        const createData = await createResponse.json();

        const userErrors = createData?.data?.productCreate?.userErrors || [];

        if (userErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Shopify rejected the product.",
                errors: userErrors
            });
        }

        const product = createData?.data?.productCreate?.product;

        if (!product) {
            return res.status(502).json({
                success: false,
                message: "Shopify did not return a created product.",
                raw: createData
            });
        }

        if (price) {
            const variantId = product.variants?.edges?.[0]?.node?.id;

            if (variantId) {
                const updateMutation = `
                    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                            productVariants {
                                id
                                price
                            }
                            userErrors {
                                field
                                message
                            }
                        }
                    }
                `;

                await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Shopify-Access-Token": accessToken
                    },
                    body: JSON.stringify({
                        query: updateMutation,
                        variables: {
                            productId: product.id,
                            variants: [
                                {
                                    id: variantId,
                                    price: String(price)
                                }
                            ]
                        }
                    })
                });
            }
        }

        return res.status(200).json({
            success: true,
            product: {
                id: product.id,
                title: product.title,
                status: product.status
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
