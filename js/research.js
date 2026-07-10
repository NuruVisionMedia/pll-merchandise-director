/*
==========================================
PLL PRODUCT RESEARCH AGENT
==========================================
*/

const Research = {

    init() {
        console.log("Product Research Agent Loaded");
    },

    analyze(input) {

        return {
            product: input,
            supplier: "",
            pillar: "",
            demand: 0,
            competition: 0,
            profitMargin: 0,
            pllScore: 0,
            recommendation: ""
        };

    }

};
