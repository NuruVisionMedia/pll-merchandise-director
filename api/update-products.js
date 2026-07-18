/*
==========================================
PLL MERCHANDISE DIRECTOR
Shopify Product Update
Writes fixes back to an EXISTING product (does not create new ones)
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
        productId,
        descriptionHtml,
        seoTitle,
        seoDescription,
        variantId,
        price
    } = req.body || {};

    if (!productId) {
        return res.status(400).json({
            success: false,
            message: "productId is required."
        });
    }

    try {
        const accessToken = await getAccessToken(storeDomain, clientId, clientSecret);
        const endpoint = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

        const updateMutation = `
            mutation productUpdate($input: ProductInput!) {
                productUpdate(input: $input) {
                    product {
                        id
                        title
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const updateResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken
            },
            body: JSON.stringify({
                query: updateMutation,
                variables: {
                    input: {
                        id: productId,
                        descriptionHtml: descriptionHtml || undefined,
                        seo: (seoTitle || seoDescription) ? {
                            title: seoTitle || undefined,
                            description: seoDescription || undefined
                        } : undefined
                    }
                }
            })
        });

        const updateData = await updateResponse.json();
        const userErrors = updateData?.data?.productUpdate?.userErrors || [];

        if (userErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Shopify rejected the update.",
                errors: userErrors
            });
        }

        if (variantId && price) {
            const variantMutation = `
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
                    query: variantMutation,
                    variables: {
                        productId: productId,
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

        return res.status(200).json({
            success: true,
            product: updateData?.data?.productUpdate?.product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
