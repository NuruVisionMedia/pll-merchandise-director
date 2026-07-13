/*
==========================================
PLL SHOPIFY PRODUCTS API
OAuth Session Authentication
==========================================
*/

export default async function handler(req, res) {

    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed."
        });
    }

    try {

        const SHOP = process.env.SHOPIFY_STORE_DOMAIN;
        const TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

        if (!SHOP) {
            return res.status(500).json({
                success: false,
                message: "SHOPIFY_STORE_DOMAIN missing."
            });
        }

        if (!TOKEN) {
            return res.status(401).json({
                success: false,
                requiresInstall: true,
                message: "No Admin API session found. Install the app from Shopify Admin."
            });
        }

        const endpoint =
            `https://${SHOP}/admin/api/2026-07/graphql.json`;

        const query = `
        {
            products(first:50){
                edges{
                    node{
                        id
                        title
                        handle
                        vendor
                        productType
                        status
                        totalInventory

                        featuredImage{
                            url
                        }

                        variants(first:10){
                            edges{
                                node{
                                    id
                                    title
                                    price
                                    sku
                                }
                            }
                        }
                    }
                }
            }
        }
        `;

        const response = await fetch(endpoint,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "X-Shopify-Access-Token":TOKEN
            },
            body:JSON.stringify({
                query
            })
        });

        const json = await response.json();

        if(json.errors){

            return res.status(500).json({
                success:false,
                errors:json.errors
            });

        }

        const products =
            json.data.products.edges.map(edge=>edge.node);

        return res.status(200).json({

            success:true,

            count:products.length,

            products

        });

    }

    catch(error){

        return res.status(500).json({

            success:false,

            message:error.message

        });

    }

}
