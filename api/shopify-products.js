/*
==========================================
PLL SHOPIFY PRODUCTS API
Reads products securely from Shopify
==========================================
*/

export default async function handler(request, response) {
    if (request.method !== "GET") {
        return response.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
    const accessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!storeDomain || !accessToken) {
        return response.status(500).json({
            success: false,
            message: "Shopify credentials are not configured."
        });
    }

    const query = `
        query GetProducts {
            products(first: 50) {
                nodes {
                    id
                    title
                    handle
                    status
                    vendor
                    productType
                    descriptionHtml
                    featuredMedia {
                        preview {
                            image {
                                url
                                altText
                            }
                        }
                    }
                }
            }
        }
    `;

    try {
        const shopifyResponse = await fetch(
            `https://${storeDomain}/admin/api/2026-07/graphql.json`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken
                },
                body: JSON.stringify({ query })
            }
        );

        const data = await shopifyResponse.json();

        if (!shopifyResponse.ok || data.errors) {
            return response.status(502).json({
                success: false,
                message: "Shopify product request failed.",
                errors: data.errors || data
            });
        }

        return response.status(200).json({
            success: true,
            products: data.data.products.nodes
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            message: error.message
        });
    }
}
