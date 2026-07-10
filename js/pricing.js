/*
==========================================
PLL PRICING AGENT
==========================================
*/

const Pricing = {

    init() {
        console.log("Pricing Agent Loaded");
    },

    calculate(productCost, targetMargin = 50) {

        const sellingPrice =
            productCost / (1 - (targetMargin / 100));

        const profit =
            sellingPrice - productCost;

        return {
            cost: productCost,
            sellingPrice: Number(sellingPrice.toFixed(2)),
            profit: Number(profit.toFixed(2)),
            margin: targetMargin
        };

    }

};
