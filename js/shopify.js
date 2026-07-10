/*
==========================================
PLL MERCHANDISE DIRECTOR
Shopify Module
==========================================
*/

const Shopify = {

    init() {
        console.log("Shopify Module Loaded");
    },

    async connect() {
        console.log("Connecting to Shopify...");

        return {
            success: false,
            message: "Shopify connection not configured."
        };
    },

    async getProducts() {
        console.log("Requesting Shopify Products...");

        return [];
    },

    async updateProduct(product) {
        console.log("Updating Shopify Product:", product);

        return {
            success: false
        };
    }

};
