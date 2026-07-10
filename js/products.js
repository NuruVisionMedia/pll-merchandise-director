/*
==========================================
PLL MERCHANDISE DIRECTOR
Products Module
==========================================
*/

const Products = {

    init() {
        console.log("Products Module Loaded");
    },

    list() {
        return PLL.state.products;
    },

    add(product) {
        PLL.state.products.push(product);
        console.log("Product Added", product);
    },

    remove(id) {
        PLL.state.products = PLL.state.products.filter(
            product => product.id !== id
        );

        console.log("Product Removed", id);
    }

};
