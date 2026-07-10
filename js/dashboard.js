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
