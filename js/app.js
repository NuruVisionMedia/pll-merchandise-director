/*
==========================================
PLL MERCHANDISE DIRECTOR
Application Entry Point
Version: 1.1
==========================================
*/

const PLL = {
    appName: "PLL Merchandise Director",
    version: "1.1.0",

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
        try {
            console.log(`${this.appName} v${this.version} Started`);

            Products.init();
            Settings.init();
            Shopify.init();
            AI.init();
            Dashboard.init();
        } catch (error) {
            console.error("Application startup failed:", error);

            document.body.innerHTML = `
                <div class="container">
                    <div class="card">
                        <h1>Application Error</h1>
                        <p>${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    PLL.init();
});
