/*
==========================================
PLL MERCHANDISE DIRECTOR
AI Module
==========================================
*/

const AI = {

    init() {
        console.log("AI Module Loaded");
    },

    async analyzeProduct(product) {

        if (!product) {
            return null;
        }

        const result = {
            pllScore: this.calculatePLLScore(product),
            seoScore: this.calculateSEOScore(product),
            recommendations: this.generateRecommendations(product)
        };

        Products.update(product.id, result);

        return result;

    },

    calculatePLLScore(product) {

        let score = 50;

        if (product.title.length > 10) score += 10;
        if (product.pillar) score += 10;
        if (product.status === "Draft") score += 5;
        if (product.status === "Review") score += 10;
        if (product.status === "Live") score += 20;

        return Math.min(score,100);

    },

    calculateSEOScore(product){

        let score = 40;

        if(product.title.length > 20) score += 20;

        if(product.title.toLowerCase().includes("prime"))
            score += 20;

        if(product.title.toLowerCase().includes("living"))
            score += 20;

        return Math.min(score,100);

    },

    generateRecommendations(product){

        const list=[];

        if(product.title.length<20)
            list.push("Improve product title.");

        if(product.seoScore<80)
            list.push("Improve SEO.");

        if(product.pllScore<85)
            list.push("Coach Marcus review recommended.");

        return list;

    }

};
