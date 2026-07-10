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

        const container = document.querySelector(".container");

        container.innerHTML = `

            <div class="card">

                <h1>PLL Merchandise Director</h1>

                <p>AI Employee Dashboard</p>

                <hr>

                <h3>System Status</h3>

                <ul>
                    <li>Application: ✅ Online</li>
                    <li>AI Module: ✅ Ready</li>
                    <li>Shopify: ⏳ Not Connected</li>
                    <li>Products Loaded: ${PLL.state.products.length}</li>
                </ul>

                <button id="refreshDashboard">
                    Refresh Dashboard
                </button>

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
