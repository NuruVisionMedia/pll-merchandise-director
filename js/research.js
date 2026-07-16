/*
==========================================
PLL PRODUCT RESEARCH AGENT
Live Shopify Product Research + AI Pillar Classification
==========================================
*/
const Research = {
    reports: [],
    init() {
        console.log("Product Research Agent Loaded");
    },
    async analyze(productName) {
        const searchName = productName.trim().toLowerCase();

        if (!searchName) {
            throw new Error("Enter a product name.");
        }

        const products = await Shopify.getProducts();

        const product = products.find(item => {
            const title = String(item.title || "").toLowerCase();
            return (
                title === searchName ||
                title.includes(searchName) ||
                searchName.includes(title)
            );
        });

        if (!product) {
            const notFound = {
                id: Date.now(),
                found: false,
                product: productName,
                message: `"${productName}" was not found in the live Shopify store.`
            };

            this.reports.push(notFound);
            return notFound;
        }

        const variants = Array.isArray(product.variants?.nodes)
            ? product.variants.nodes
            : [];

        const prices = variants
            .map(variant => Number(variant.price))
            .filter(price => Number.isFinite(price));

        const margins = [];
        const costs = [];

        variants.forEach(variant => {
            const price = Number(variant.price);
            const cost = Number(variant.inventoryItem?.unitCost?.amount);

            if (Number.isFinite(price) && price > 0 && Number.isFinite(cost) && cost > 0) {
                margins.push(((price - cost) / price) * 100);
                costs.push(cost);
            }
        });

        const profitMargin = margins.length
            ? Number((margins.reduce((sum, m) => sum + m, 0) / margins.length).toFixed(1))
            : null;

        const averageCost = costs.length
            ? Number((costs.reduce((sum, c) => sum + c, 0) / costs.length).toFixed(2))
            : null;

        const pillarResult = await this.classifyPillar(product);

        const report = {
            id: Date.now(),
            found: true,
            product: product.title,
            supplier: product.vendor || "Not assigned",
            pillar: pillarResult.pillar,
            pillarReasoning: pillarResult.reasoning,
            status: product.status || "Unknown",
            totalInventory: Number(product.totalInventory || 0),
            variantCount: variants.length,
            minimumPrice: prices.length ? Math.min(...prices) : 0,
            maximumPrice: prices.length ? Math.max(...prices) : 0,
            skuList: variants.map(v => v.sku).filter(Boolean),
            imageUrl: product.featuredMedia?.preview?.image?.url || "",
            profitMargin,
            averageCost,
            demand: "Needs Manual Review",
            competition: "Needs Manual Review",
            trendScore: null,
            coachScore: null,
            brandScore: null,
            repeatPurchaseScore: null,
            shippingScore: null,
            pllScore: null,
            recommendation: "Needs Manual Review",
            approved: false
        };

        this.reports.push(report);

        return report;
    },
    async classifyPillar(product) {
        try {
            const response = await fetch("/api/classify-pillar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: product.title,
                    productType: product.productType,
                    description: (product.descriptionHtml || "").replace(/<[^>]*>/g, "")
                })
            });

            const data = await response.json();

            if (!data.success) {
                return {
                    pillar: this.detectPillarFallback(product.title),
                    reasoning: "AI classification unavailable — used keyword fallback."
                };
            }

            return {
                pillar: data.pillar,
                reasoning: data.reasoning
            };

        } catch (error) {
            return {
                pillar: this.detectPillarFallback(product.title),
                reasoning: "AI classification unavailable — used keyword fallback."
            };
        }
    },
    detectPillarFallback(productName) {
        const name = productName.toLowerCase();

        if (
            name.includes("protein") ||
            name.includes("vitamin") ||
            name.includes("creatine")
        ) {
            return "FUEL";
        }

        if (
            name.includes("journal") ||
            name.includes("sleep") ||
            name.includes("meditation")
        ) {
            return "FOCUS";
        }

        return "TRAIN";
    },
    find(id) {
        return this.reports.find(report => report.id === id);
    },
    getReports() {
        return this.reports;
    }
};
