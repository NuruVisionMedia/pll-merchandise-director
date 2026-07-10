/*
==========================================
PLL MERCHANDISE DIRECTOR
Dashboard Module
==========================================
*/

const Dashboard = {

    init() {
        console.log("Dashboard Module Loaded");
        this.render();
    },

    render() {
        const app = document.getElementById("app");

        if (!app) {
            throw new Error("Application root not found.");
        }

        const products = Products.list();

        app.innerHTML = `
            <div class="container">

                <div class="card">
                    <h1>PLL Merchandise Director</h1>
                    <p>AI Employee Dashboard</p>
                </div>

                <div class="card">
                    <h3>System Status</h3>

                    <ul>
                        <li>Application: Online</li>
                        <li>AI Module: Ready</li>
                        <li>
                            Shopify:
                            ${Shopify.isConnected() ? "Connected" : "Not Connected"}
                        </li>
                        <li>Products Loaded: ${products.length}</li>
                    </ul>
                </div>

                <div class="card">
                    <h3>Add Product</h3>

                    <form id="productForm">
                        <input
                            id="productTitle"
                            type="text"
                            placeholder="Product title"
                            required
                        >

                        <select id="productPillar">
                            <option value="TRAIN">TRAIN</option>
                            <option value="FUEL">FUEL</option>
                            <option value="FOCUS">FOCUS</option>
                        </select>

                        <button type="submit">
                            Add Product
                        </button>
                    </form>
                </div>

                <div class="card">
                    <h3>Products</h3>

                    <div id="productList">
                        ${
                            products.length
                                ? products.map(product => `
                                    <div class="product-row">
                                        <div>
                                            <strong>${product.title}</strong>
                                            <span>${product.pillar}</span>
                                        </div>

                                        <button
                                            class="removeProduct"
                                            data-id="${product.id}"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                `).join("")
                                : "<p>No products added yet.</p>"
                        }
                    </div>
                </div>

            </div>
        `;

        document
            .getElementById("productForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const title =
                    document.getElementById("productTitle").value.trim();

                const pillar =
                    document.getElementById("productPillar").value;

                Products.add({
                    title,
                    pillar,
                    status: "Draft"
                });

                this.render();
            });

        document
            .querySelectorAll(".removeProduct")
            .forEach(button => {
                button.addEventListener("click", () => {
                    Products.remove(Number(button.dataset.id));
                    this.render();
                });
            });
    },

    refresh() {
        this.render();
    }

};                            Shopify:
                            ${Shopify.isConnected() ? "Connected" : "Not Connected"}
                        </li>
                        <li>
                            Products Loaded:
                            ${PLL.state.products.length}
                        </li>
                    </ul>

                    <button id="refreshDashboard">
                        Refresh Dashboard
                    </button>
                </div>

            </div>
        `;

        document
            .getElementById("refreshDashboard")
            .addEventListener("click", () => {
                this.refresh();
            });
    },

    refresh() {
        console.log("Dashboard Refreshed");
        this.render();
    }

};
