/*
==========================================
PLL SHOPIFY CLIENT
==========================================
*/

const Shopify = {

    init() {
        console.log("Shopify Client Loaded");
    },

    async getProducts() {

        const response = await fetch("/api/shopify-products");

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        return data.products;
    },

    async syncProducts() {

        const products = await this.getProducts();

        PLL.state.products = products;

        if (typeof Products !== "undefined") {
            Products.save();
        }

        return products;
    }

};
