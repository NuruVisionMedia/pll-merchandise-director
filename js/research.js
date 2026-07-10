/*
==========================================
PLL PRODUCT RESEARCH AGENT
==========================================
*/

const Research = {

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
            pllScore: 0,
            recommendation: ""
        };

        report.pllScore = this.calculatePLLScore(report);
        report.recommendation = this.recommend(report.pllScore);

        return report;
    },

    detectPillar(productName) {

        const name = productName.toLowerCase();

        if (name.includes("protein") ||
            name.includes("vitamin") ||
            name.includes("creatine"))
            return "FUEL";

        if (name.includes("journal") ||
            name.includes("sleep") ||
            name.includes("meditation"))
            return "FOCUS";

        return "TRAIN";

    },

    calculatePLLScore(report) {

        return Math.round(

            (report.demand * 0.35) +

            ((100 - report.competition) * 0.20) +

            (report.profitMargin * 0.45)

        );

    },

    recommend(score) {

        if (score >= 90) return "APPROVE";

        if (score >= 80) return "STRONG CANDIDATE";

        if (score >= 70) return "RESEARCH FURTHER";

        return "REJECT";

    }

};
