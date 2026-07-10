/*
==========================================
PLL AI OPERATIONS
Application Entry Point
Version: 2.0
==========================================
*/

const PLL = {

    appName: "PLL AI Operations",

    version: "2.0.0",

    state: {

        currentPage: "dashboard",

        products: [],

        settings: {}

    },

    init() {

        console.log(
            `${this.appName} v${this.version} Started`
        );

        Products.init();
        Settings.init();
        Shopify.init();

        AI.init();
        Research.init();
        Pricing.init();
        Content.init();
        Social.init();

        Dashboard.init();

    }

};

document.addEventListener("DOMContentLoaded", () => {

    PLL.init();

});
