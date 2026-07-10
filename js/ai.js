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
            throw new Error("A valid product is required.");
        }

        const pllScore = this.calculatePLLScore(product);
        const seoScore = this.calculateSEOScore(product);

        const recommendations = this.generateRecommendations({
            ...product,
            pllScore,
            seoScore
        });

        const result = {
            pllScore,
            seoScore,
            recommendations,
            status: pllScore >= 85 ? "Review" : "Draft"
        };

        Products.update(product.id, result);

        return result;
    },

    calculatePLLScore(product) {
        let score = 50;

        if (product.title && product.title.length > 10) {
            score += 10;
        }

        if (product.pillar) {
            score += 15;
        }

        if (product.title && product.title.length > 20) {
            score += 10;
        }

        if (
            product.title &&
            product.title.toLowerCase().includes("prime")
        ) {
            score += 15;
        }

        return Math.min(score, 100);
    },

    calculateSEOScore(product) {
        let score = 40;

        if (product.title && product.title.length >= 20) {
            score += 25;
        }

        if (product.title && product.title.length <= 60) {
            score += 15;
        }

        if (
            product.title &&
            product.title.toLowerCase().includes(product.pillar.toLowerCase())
        ) {
            score += 20;
        }

        return Math.min(score, 100);
    },

    generateRecommendations(product) {
        const recommendations = [];

        if (!product.title || product.title.length < 20) {
            recommendations.push(
                "Expand the product title with clearer benefits."
            );
        }

        if (product.seoScore < 80) {
            recommendations.push(
                "Improve the SEO title and keyword targeting."
            );
        }

        if (product.pllScore < 85) {
            recommendations.push(
                "Product requires Coach Marcus review."
            );
        }

        if (recommendations.length === 0) {
            recommendations.push(
                "Product meets the current PLL quality standard."
            );
        }

        return recommendations;
    }

};
