/*
==========================================
PLL MERCHANDISE DIRECTOR LOCAL HANDOFF QUEUE
==========================================
*/

const Queue = {

    storageKey: "pll-md-handoff-queue",

    items: [],

    init() {
        console.log("Merchandise Director Queue Loaded");
        this.load();
    },

    load() {
        const saved = localStorage.getItem(this.storageKey);

        this.items = saved ? JSON.parse(saved) : [];

        return this.items;
    },

    save() {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(this.items)
        );
    },

    add(report) {
        const existing = this.items.find(
            item =>
                item.product.toLowerCase() ===
                report.product.toLowerCase()
        );

        if (existing) {
            return existing;
        }

        const item = {
            id: Date.now(),
            product: report.product,
            supplier: report.supplier,
            pillar: report.pillar,
            pillarReasoning: report.pillarReasoning || "",
            demand: report.demand,
            competition: report.competition,
            profitMargin: report.profitMargin,
            averageCost: report.averageCost,
            trendScore: report.trendScore,
            coachScore: report.coachScore,
            brandScore: report.brandScore,
            repeatPurchaseScore: report.repeatPurchaseScore,
            shippingScore: report.shippingScore,
            pllScore: report.pllScore,
            recommendation: report.recommendation,
            contentReport: report.contentReport || null,
            socialPost: report.socialPost || null,
            pricingReport: report.pricingReport || null,
            status: "Pending Merchandise Director Review",
            approved: false,
            addedToProducts: false,
            shopifyProductId: null,
            createdAt: new Date().toISOString()
        };

        this.items.push(item);
        this.save();

        return item;
    },

    approve(id) {
        const item = this.find(id);

        if (!item) {
            return null;
        }

        item.approved = true;
        item.status = "Approved by Merchandise Director";

        this.save();

        return item;
    },

    reject(id) {
        const item = this.find(id);

        if (!item) {
            return null;
        }

        item.approved = false;
        item.status = "Rejected by Merchandise Director";

        this.save();

        return item;
    },

    addToProducts(id, shopifyProductId = null) {
        const item = this.find(id);

        if (!item || !item.approved || item.addedToProducts) {
            return null;
        }

        const product = Products.add({
            title: item.product,
            pillar: item.pillar,
            status: "Draft",
            pllScore: item.pllScore,
            seoScore: 0,
            recommendations: [
                `Research recommendation: ${item.recommendation}`
            ]
        });

        item.addedToProducts = true;
        item.shopifyProductId = shopifyProductId;
        item.status = shopifyProductId
            ? "Created in Shopify"
            : "Added to Merchandise Director Products";

        this.save();

        return product;
    },

    find(id) {
        return this.items.find(
            item => item.id === id
        );
    },

    remove(id) {
        this.items = this.items.filter(
            item => item.id !== id
        );

        this.save();
    },

    list() {
        return this.items;
    }

};
