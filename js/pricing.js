/*
==========================================
PLL PRICING AGENT
==========================================
*/

const Pricing = {

    reports: [],

    init() {
        console.log("Pricing Agent Loaded");
    },

    calculate(productCost, targetMargin = 50) {

        const sellingPrice =
            productCost / (1 - (targetMargin / 100));

        const profit =
            sellingPrice - productCost;

        const report = {
            id: Date.now(),
            cost: Number(productCost),
            sellingPrice: Number(sellingPrice.toFixed(2)),
            profit: Number(profit.toFixed(2)),
            margin: targetMargin,
            recommendedDiscount: this.recommendedDiscount(targetMargin)
        };

        this.reports.push(report);

        return report;
    },

    recommendedDiscount(margin) {

        if (margin >= 60) return "20%";

        if (margin >= 50) return "15%";

        if (margin >= 40) return "10%";

        return "None";

    },

    getReports() {
        return this.reports;
    }

};
