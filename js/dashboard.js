/*
==========================================
PLL AI OPERATIONS
Dashboard Module
==========================================
*/

const Dashboard = {

    init() {
        console.log("Dashboard Module Loaded");

        if (typeof Queue !== "undefined") {
            Queue.init();
        }

        this.render();
    },

    render() {
        const app = document.getElementById("app");

        if (!app) {
            throw new Error("Application root not found.");
        }

        const queueItems =
            typeof Queue !== "undefined" ? Queue.list() : [];

        app.innerHTML = `
            <div class="container">

                <div class="card">
                    <h1>PLL AI Operations</h1>
                    <p>Support Agents for the PLL Merchandise Director</p>
                </div>

                <div class="card">
                    <h3>Product Research Agent</h3>

                    <form id="researchForm">
                        <input
                            id="researchProduct"
                            type="text"
                            placeholder="Enter product name"
                            required
                        >

                        <button type="submit">
                            Analyze Product
                        </button>
                    </form>

                    <div id="researchResult"></div>
                </div>

                <div class="card">
                    <h3>Pricing Agent</h3>

                    <form id="pricingForm">
                        <input
                            id="productCost"
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="Product cost"
                            required
                        >

                        <input
                            id="targetMargin"
                            type="number"
                            min="1"
                            max="95"
                            value="50"
                            placeholder="Target margin"
                            required
                        >

                        <button type="submit">
                            Calculate Price
                        </button>
                    </form>

                    <div id="pricingResult"></div>
                </div>

                <div class="card">
                    <h3>Content Creator</h3>

                    <form id="contentForm">
                        <input
                            id="contentProduct"
                            type="text"
                            placeholder="Enter product name"
                            required
                        >

                        <button type="submit">
                            Generate Content
                        </button>
                    </form>

                    <div id="contentResult"></div>
                </div>

                <div class="card">
                    <h3>Social Media Agent</h3>

                    <form id="socialForm">
                        <input
                            id="socialProduct"
                            type="text"
                            placeholder="Enter product name"
                            required
                        >

                        <button type="submit">
                            Generate Posts
                        </button>
                    </form>

                    <div id="socialResult"></div>
                </div>

                <div class="card">
                    <h3>Merchandise Director Queue</h3>

                    <p>
                        Products approved by the Product Research Agent
                        appear here.
                    </p>

                    <div id="queueList">
                        ${
                            queueItems.length
                                ? queueItems.map(item => `
                                    <div class="product-row">
                                        <div>
                                            <strong>${item.product}</strong>
                                            <span>Pillar: ${item.pillar}</span>
                                            <span>PLL Score: ${item.pllScore}</span>
                                            <span>${item.recommendation}</span>
                                            <span>${item.status}</span>
                                        </div>

                                        <button
                                            class="removeQueueItem"
                                            data-id="${item.id}"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                `).join("")
                                : "<p>No products are waiting for review.</p>"
                        }
                    </div>
                </div>

            </div>
        `;

        this.attachEvents();
    },

    attachEvents() {
        const researchForm =
            document.getElementById("researchForm");

        researchForm.addEventListener("submit", event => {
            event.preventDefault();

            const product =
                document
                    .getElementById("researchProduct")
                    .value
                    .trim();

            const report = Research.analyze(product);

            let queueMessage =
                "Not added to Merchandise Director Queue.";

            if (
                report.recommendation === "APPROVE" ||
                report.recommendation === "STRONG CANDIDATE"
            ) {
                Queue.add(report);

                queueMessage =
                    "Added to Merchandise Director Queue.";
            }

            document.getElementById("researchResult").innerHTML = `
                <div class="result-box">
                    <strong>${report.product}</strong>
                    <p>Pillar: ${report.pillar}</p>
                    <p>Demand: ${report.demand}</p>
                    <p>Competition: ${report.competition}</p>
                    <p>Profit Margin: ${report.profitMargin}%</p>
                    <p>Trend Score: ${report.trendScore}</p>
                    <p>Coach Score: ${report.coachScore}</p>
                    <p>Brand Score: ${report.brandScore}</p>
                    <p>Shipping Score: ${report.shippingScore}</p>
                    <p>PLL Score: ${report.pllScore}</p>
                    <p>
                        Recommendation:
                        <strong>${report.recommendation}</strong>
                    </p>
                    <p>${queueMessage}</p>
                    <p>Queue Size: ${Queue.list().length}</p>
                </div>
            `;

            setTimeout(() => {
                this.render();
            }, 1200);
        });

        const pricingForm =
            document.getElementById("pricingForm");

        pricingForm.addEventListener("submit", event => {
            event.preventDefault();

            const cost =
                Number(
                    document.getElementById("productCost").value
                );

            const margin =
                Number(
                    document.getElementById("targetMargin").value
                );

            const report =
                Pricing.calculate(cost, margin);

            document.getElementById("pricingResult").innerHTML = `
                <div class="result-box">
                    <p>
                        Recommended Price:
                        $${report.psychologicalPrice}
                    </p>
                    <p>
                        Estimated Profit:
                        $${report.profit}
                    </p>
                    <p>ROI: ${report.roi}%</p>
                    <p>
                        Suggested Discount:
                        ${report.discount}%
                    </p>
                </div>
            `;
        });

        const contentForm =
            document.getElementById("contentForm");

        contentForm.addEventListener("submit", event => {
            event.preventDefault();

            const product =
                document
                    .getElementById("contentProduct")
                    .value
                    .trim();

            const report =
                Content.generate(product);

            document.getElementById("contentResult").innerHTML = `
                <div class="result-box">
                    <h4>${report.headline}</h4>
                    <p>${report.shortDescription}</p>
                    <p>${report.longDescription}</p>

                    <h4>Benefits</h4>

                    <ul>
                        ${report.bullets
                            .map(item => `<li>${item}</li>`)
                            .join("")}
                    </ul>

                    <p>
                        <strong>Call to Action:</strong>
                        ${report.callToAction}
                    </p>

                    <p>
                        <strong>SEO Title:</strong>
                        ${report.seoTitle}
                    </p>

                    <p>
                        <strong>SEO Description:</strong>
                        ${report.seoDescription}
                    </p>

                    <p>
                        <strong>Hashtags:</strong>
                        ${report.hashtags.join(" ")}
                    </p>
                </div>
            `;
        });

        const socialForm =
            document.getElementById("socialForm");

        socialForm.addEventListener("submit", event => {
            event.preventDefault();

            const product =
                document
                    .getElementById("socialProduct")
                    .value
                    .trim();

            const post =
                Social.generate(product);

            document.getElementById("socialResult").innerHTML = `
                <div class="result-box">
                    <h4>Instagram</h4>
                    <p>${post.instagram.replace(/\n/g, "<br>")}</p>

                    <h4>Facebook</h4>
                    <p>${post.facebook.replace(/\n/g, "<br>")}</p>

                    <h4>X</h4>
                    <p>${post.x.replace(/\n/g, "<br>")}</p>

                    <h4>TikTok</h4>
                    <p>${post.tiktok.replace(/\n/g, "<br>")}</p>

                    <h4>YouTube</h4>
                    <p>${post.youtube.replace(/\n/g, "<br>")}</p>
                </div>
            `;
        });

        document
            .querySelectorAll(".removeQueueItem")
            .forEach(button => {
                button.addEventListener("click", () => {
                    Queue.remove(
                        Number(button.dataset.id)
                    );

                    this.render();
                });
            });
    }

};
