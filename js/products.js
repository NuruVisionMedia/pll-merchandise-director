/*
==========================================
PLL MERCHANDISE DIRECTOR
Products Module
==========================================
*/
const Products = {
    storageKey: "pll-products",
    init() {
        console.log("Products Module Loaded");
        this.load();
    },
    load() {
        const savedProducts = localStorage.getItem(this.storageKey);
        if (savedProducts) {
            PLL.state.products = JSON.parse(savedProducts);
        }
        return PLL.state.products;
    },
    save() {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(PLL.state.products)
        );
    },
    list() {
        return PLL.state.products;
    },
    add(product) {
        const newProduct = {
            id: Date.now(),
            title: product.title || "Untitled Product",
            pillar: product.pillar || "TRAIN",
            status: product.status || "Draft",
            pllScore: product.pllScore || 0,
            seoScore: product.seoScore || 0,
            recommendations: product.recommendations || []
        };
        PLL.state.products.push(newProduct);
        this.save();
        return newProduct;
    },
    update(id, updates) {
        const product = this.findById(id);
        if (!product) {
            return null;
        }
        Object.assign(product, updates);
        this.save();
        return product;
    },
    remove(id) {
        PLL.state.products = PLL.state.products.filter(
            product => product.id !== id
        );
        this.save();
    },
    findById(id) {
        return PLL.state.products.find(
            product => product.id === id
        );
    }
};
