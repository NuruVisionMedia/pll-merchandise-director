/*
==========================================
PLL MERCHANDISE DIRECTOR HANDOFF QUEUE
==========================================
*/

const Queue = {

    storageKey: "pll-md-handoff-queue",
    endpointKey: "pll-md-endpoint",

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
            demand: report.demand,
            competition: report.competition,
            profitMargin: report.profitMargin,
            trendScore: report.trendScore,
            coachScore: report.coachScore,
            brandScore: report.brandScore,
            shippingScore: report.shippingScore,
            pllScore: report.pllScore,
            recommendation: report.recommendation,
            status: "Pending Handoff",
            sent: false,
            createdAt: new Date().toISOString(),
            sentAt: null
        };

        this.items.push(item);
        this.save();

        return item;
    },

    setEndpoint(url) {
        localStorage.setItem(this.endpointKey, url.trim());
    },

    getEndpoint() {
        return localStorage.getItem(this.endpointKey) || "";
    },

    async send(id) {
        const item = this.find(id);
        const endpoint = this.getEndpoint();

        if (!item) {
            throw new Error("Queue item not found.");
        }

        if (!endpoint) {
            return {
                success: false,
                message: "Merchandise Director endpoint is not configured."
            };
        }

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });

        if (!response.ok) {
            throw new Error(
                `Handoff failed with status ${response.status}.`
            );
        }

        item.sent = true;
        item.status = "Sent to Merchandise Director";
        item.sentAt = new Date().toISOString();

        this.save();

        return {
            success: true,
            item
        };
    },

    async sendAllApproved() {
        const pendingItems = this.items.filter(
            item =>
                !item.sent &&
                (
                    item.recommendation === "APPROVE" ||
                    item.recommendation === "STRONG CANDIDATE"
                )
        );

        const results = [];

        for (const item of pendingItems) {
            results.push(await this.send(item.id));
        }

        return results;
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
