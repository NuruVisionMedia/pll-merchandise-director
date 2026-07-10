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
        this.loadConnectionStatus();
    },

    loadConnectionStatus() {
        this.connected =
            localStorage.getItem("pll-shopify-connected") === "true";

        return this.connected;
    },

    async connect(storeDomain) {
        if (!storeDomain || typeof storeDomain !== "string") {
            throw new Error("A valid Shopify store domain is required.");
        }

        console.log("Preparing Shopify connection:", storeDomain);

        this.connected = false;

        localStorage.setItem(
            "pll-shopify-store",
            storeDomain
        );

        localStorage.setItem(
            "pll-shopify-connected",
            "false"
        );

        return {
            success: false,
            connected: false,
            message:
                "Shopify API credentials have not been configured yet."
        };
    },

    disconnect() {
        this.connected = false;

        localStorage.removeItem("pll-shopify-store");
        localStorage.setItem(
            "pll-shopify-connected",
            "false"
        );

        return {
            success: true,
            connected: false
        };
    },

    isConnected() {
        return this.connected;
    },

    async getProducts() {
        if (!this.connected) {
            return [];
        }

        return PLL.state.products;
    },

    async updateProduct(product) {
        if (!this.connected) {
            return {
                success: false,
                message: "Shopify is not connected."
            };
        }

        return {
            success: true,
            product
        };
    }

};
