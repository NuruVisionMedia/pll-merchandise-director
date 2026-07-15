/*
==========================================
PLL PRODUCT RESEARCH AGENT
Live Shopify Product Research
==========================================
*/

const Research = {

    reports: [],

    init() {
        console.log("Live Shopify Product Research Agent Loaded");
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
            return {
                found: false,
                product: productName,
                message: `"${productName}" was not found in the live Shopify store.`
            };
        }

        const variants = Array.isArray(product.variants?.edges)
            ? product.variants.edges.map(edge => edge.node)
            : [];

        const prices = variants
            .map(variant => Number(variant.price))
            .filter(price => Number.isFinite(price));

        const report = {
            id: Date.now(),
            found: true,
            source: "Live Shopify Store",
            shopifyId: product.id,
            product: product.title,
            handle: product.handle || "",
            vendor: product.vendor || "Not assigned",
            productType: product.productType || "Not assigned",
            status: product.status || "Unknown",
            totalInventory: Number(product.totalInventory || 0),
            imageUrl: product.featuredImage?.url || "",
            variantCount: variants.length,
            variants,
            minimumPrice: prices.length ? Math.min(...prices) : 0,
            maximumPrice: prices.length ? Math.max(...prices) : 0,
            skuList: variants
                .map(variant => variant.sku)
                .filter(Boolean),
            researchedAt: new Date().toISOString()
        };

        this.reports.push(report);

        return report;
    },

    find(id) {
        return this.reports.find(report => report.id === id);
    },

    getReports() {
        return this.reports;
    }

};
