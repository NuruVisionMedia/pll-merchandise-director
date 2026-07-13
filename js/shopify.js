/*
==========================================
PLL SHOPIFY CLIENT
==========================================
*/

const Shopify = {

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
