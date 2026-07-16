/*
==========================================
PLL MERCHANDISE DIRECTOR
Shopify Module
==========================================
*/
const Shopify = {
    connected: false,
    init() {
        console.log("Shopify Module Loaded");
    },
    async getProducts() {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "Unable to retrieve Shopify products.");
        }

        this.connected = true;
        return data.products;
    },
    isConnected() {
        return this.connected;
    }
};
