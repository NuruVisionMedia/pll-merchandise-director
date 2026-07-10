/*
==========================================
PLL MERCHANDISE DIRECTOR HANDOFF QUEUE
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
        const item = {
            id: Date.now(),
            product: report.product,
            pillar: report.pillar,
            pllScore: report.pllScore,
            recommendation: report.recommendation,
            status: "Ready for Merchandise Director",
            createdAt: new Date().toISOString()
        };

        this.items.push(item);
        this.save();

        return item;
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
