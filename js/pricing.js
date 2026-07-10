/*
==========================================
PLL PRICING AGENT
Version 1.1
==========================================
*/

const Pricing = {

    reports: [],

    init() {
        console.log("Pricing Agent Loaded");
    },

    calculate(cost, targetMargin = 50) {

        const sellingPrice =
            cost / (1 - targetMargin / 100);

        const profit = sellingPrice - cost;

        const report = {
            id: Date.now(),

            cost: Number(cost),

            sellingPrice: Number(sellingPrice.toFixed(2)),

            profit: Number(profit.toFixed(2)),

            margin: Number(targetMargin),

            roi: this.calculateROI(cost, profit),

            discount: this.recommendedDiscount(targetMargin),

            psychologicalPrice:
                this.psychologicalPrice(sellingPrice)
        };

        this.reports.push(report);

        return report;

    },

    calculateROI(cost, profit) {

        return Number(((profit / cost) * 100).toFixed(1));

    },

    psychologicalPrice(price) {

        return Number(
            (Math.floor(price) + 0.99).toFixed(2)
        );

    },

    recommendedDiscount(margin) {

        if (margin >= 60) return 20;

        if (margin >= 50) return 15;

        if (margin >= 40) return 10;

        return 0;

    },

    getReports() {

        return this.reports;

    }

};
