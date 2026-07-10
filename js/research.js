/*
==========================================
PLL PRODUCT RESEARCH AGENT
==========================================
*/

const Research = {

    reports: [],

    init() {
        console.log("Product Research Agent Loaded");
    },

    analyze(productName) {

        const report = {
            id: Date.now(),
            product: productName,
            supplier: "Pending",
            pillar: this.detectPillar(productName),

            demand: 75,
            competition: 50,
            profitMargin: 60,
            trendScore: this.calculateTrendScore(),

            coachScore: this.calculateCoachScore(),
            brandScore: this.calculateBrandScore(),
            repeatPurchaseScore: this.calculateRepeatPurchaseScore(),

            pllScore: 0,
            recommendation: ""
        };

        report.pllScore = this.calculatePLLScore(report);
        report.recommendation = this.recommend(report.pllScore);

        this.reports.push(report);

        return report;
    },

    detectPillar(productName) {

        const name = productName.toLowerCase();

        if (
            name.includes("protein") ||
            name.includes("vitamin") ||
            name.includes("creatine")
        ) return "FUEL";

        if (
            name.includes("journal") ||
            name.includes("sleep") ||
            name.includes("meditation")
        ) return "FOCUS";

        return "TRAIN";

    },

    calculateTrendScore() {
        return Math.floor(Math.random() * 21) + 80;
    },

    calculateCoachScore() {
        return Math.floor(Math.random() * 16) + 85;
    },

    calculateBrandScore() {
        return Math.floor(Math.random() * 21) + 80;
    },

    calculateRepeatPurchaseScore() {
        return Math.floor(Math.random() * 21) + 80;
    },

    calculatePLLScore(report) {

        return Math.round(

            (report.demand * 0.20) +

            ((100 - report.competition) * 0.15) +

            (report.profitMargin * 0.20) +

            (report.trendScore * 0.15) +

            (report.coachScore * 0.10) +

            (report.brandScore * 0.10) +

            (report.repeatPurchaseScore * 0.10)

        );

    },

    recommend(score) {

        if (score >= 90) return "APPROVE";
        if (score >= 80) return "STRONG CANDIDATE";
        if (score >= 70) return "RESEARCH FURTHER";

        return "REJECT";

    },

    getReports() {
        return this.reports;
    }

};
