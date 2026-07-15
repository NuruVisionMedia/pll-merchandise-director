/*
==========================================
PLL MERCHANDISE DIRECTOR
Products Module (client-side store)
==========================================
*/

const Products = {

    storageKey: "pll-products",

    items: [],

    init() {
        console.log("Products Module Loaded");
        this.load();
    },

    load() {
        const saved = localStorage.getItem(this.storageKey);

        this.items = saved ? JSON.parse(saved) : [];

        PLL.state.products = this.items;

        return this.items;
    },

    save() {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(this.items)
        );

        PLL.state.products = this.items;
    },

    add(product) {
        const item = {
            id: Date.now(),
            title: product.title,
            pillar: product.pillar || "Unassigned",
            status: product.status || "Draft",
            pllScore: product.pllScore ?? 0,
            seoScore: product.seoScore ?? 0,
            recommendations: product.recommendations || [],
            createdAt: new Date().toISOString()
        };

        this.items.push(item);
        this.save();

        return item;
    },

    update(id, changes) {
        const item = this.find(id);

        if (!item) {
            return null;
        }

        Object.assign(item, changes);
        this.save();

        return item;
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
