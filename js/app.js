/*
==========================================
PLL MERCHANDISE DIRECTOR
Application Entry Point
Version: 1.0
==========================================
*/

const PLL = {
    appName: "PLL Merchandise Director",
    version: "1.0.0",

    state: {
        currentPage: "dashboard",
        selectedProduct: null,
        products: [],
        collections: [],
        tasks: [],
        analytics: {},
        settings: {}
    },

    init() {
        console.log(`${this.appName} v${this.version} Started`);

        Dashboard.init();
        Products.init();
        AI.init();
        Shopify.init();
        Settings.init();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    PLL.init();
});
