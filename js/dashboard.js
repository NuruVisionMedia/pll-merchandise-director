/*
==========================================
PLL AI OPERATIONS
Dashboard Module
==========================================
*/

const Dashboard = {

    init() {
        Queue.init();
        this.render();
    },

    render() {
        const app = document.getElementById("app");

        if (!app) {
            throw new Error("Application root not found.");
        }

        const queueItems = Queue.list();

        app.innerHTML = `
            <div class="container">

                <div class="card">
                    <h1>PLL AI Operations</h1>
                    <p>Support Agents for the PLL Merchandise Director</p>
                </div>

                <div class="card">
                    <h3>Product Research Agent</h3>
                    <p>Researching a product automatically runs Pricing, Content, and Social too.</p>

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
                    <p>Manual pricing calculator (also runs automatically during research).</p>

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
                    <p>Manual content generator (also runs automatically during research).</p>

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
                    <p>Manual social generator (also runs automatically during research).</p>

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

                    <div id="queueList">
                        ${
                            queueItems.length
                                ? queueItems.map(item => `
                                    <div class="product-row">
                                        <div>
                                            <strong>${item.product}</strong>
                                            <span>Pillar: ${item.pillar}</span>
                                            <span>PLL Score: ${item.pllScore ?? "Needs Manual Review"}</span>
                                            <span>
                                                Recommendation:
                                                ${item.recommendation}
                                            </span>
                                            <span>Status: ${item.status}</span>
                                            ${
                                                item.shopifyProductId
                                                    ? `<span>Shopify ID: ${item.shopifyProductId}</span>`
                                                    : ""
                                            }
                                        </div>

                                        <div class="queue-actions">
                                            ${
                                                !item.approved &&
                                                item.status !==
                                                    "Rejected by Merchandise Director"
                                                    ? `
                                                        <button
                                                            class="approveQueueItem"
                                                            data-id="${item.id}"
                                                        >
                                                            Approve
                                                        </button>

                                                        <button
                                                            class="rejectQueueItem"
                                                            data-id="${item.id}"
                                                        >
                                                            Reject
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                            ${
                                                item.approved &&
                                                !item.addedToProducts
                                                    ? `
                                                        <button
                                                            class="addQueueProduct"
                                                            data-id="${item.id}"
                                                        >
                                                            Add to Products
                                                        </button>
                                                    `
                                                    : ""
                                            }

                                            <button
                                                class="removeQueueItem"
                                                data-id="${item.id}"
                                            >
                                                Remove
                                            </button>
                                        </div>
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

    renderContentHtml(report) {
        return `
            <h4>${report.headline}</h4>
            <p>${report.shortDescription}</p>
            <p>${report.longDescription}</p>

            <h4>Benefits</h4>
            <ul>
                ${report.bullets.map(item => `<li>${item}</li>`).join("")}
            </ul>

            <p><strong>Call to Action:</strong> ${report.callToAction}</p>
            <p><strong>SEO Title:</strong> ${report.seoTitle}</p>
            <p><strong>SEO Description:</strong> ${report.seoDescription}</p>
            <p><strong>Hashtags:</strong> ${report.hashtags.join(" ")}</p>
        `;
    },

    renderSocialHtml(post) {
        return `
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
        `;
    },

    renderPricingHtml(report) {
        return `
            <p>Recommended Price: $${report.psychologicalPrice}</p>
            <p>Estimated Profit: $${report.profit}</p>
            <p>ROI: ${report.roi}%</p>
            <p>Suggested Discount: ${report.discount}%</p>
        `;
    },

    attachEvents() {
        document
            .getElementById("researchForm")
            .addEventListener("submit", async event => {
                event.preventDefault();

                const product = document
                    .getElementById("researchProduct")
                    .value
                    .trim();

                const resultContainer =
                    document.getElementById("researchResult");

                resultContainer.innerHTML = `
                    <div class="result-box">
                        <p>Searching the live Shopify store and running all agents...</p>
                    </div>
                `;

                try {
                    const report = await Research.analyze(product);

                    if (!report.found) {
                        resultContainer.innerHTML = `
                            <div class="result-box">
                                <strong>Product Not Found</strong>
                                <p>${report.message}</p>
                            </div>
                        `;
                        return;
                    }

                    const contentReport = Content.generate(report.product);
                    const socialPost = Social.generate(report.product);
                    const pricingReport = report.averageCost !== null
                        ? Pricing.calculate(report.averageCost, 50)
                        : null;

                    report.contentReport = contentReport;
                    report.socialPost = socialPost;
                    report.pricingReport = pricingReport;

                    resultContainer.innerHTML = `
                        <div class="result-box">
                            <strong>${report.product}</strong>
                            <p>Pillar: ${report.pillar}</p>
                            <p><em>${report.pillarReasoning || ""}</em></p>
                            <p>Supplier/Vendor: ${report.supplier}</p>
                            <p>Status: ${report.status}</p>
                            <p>Total Inventory: ${report.totalInventory}</p>
                            <p>Variants: ${report.variantCount}</p>
                            <p>
                                Price Range:
                                $${report.minimumPrice.toFixed(2)}
                                –
                                $${report.maximumPrice.toFixed(2)}
                            </p>
                            <p>
                                Profit Margin:
                                ${report.profitMargin !== null
                                    ? report.profitMargin + "%"
                                    : "N/A (cost data unavailable)"}
                            </p>
                            <p>Demand: ${report.demand}</p>
                            <p>Competition: ${report.competition}</p>
                            <p>PLL Score: ${report.pllScore ?? "Needs Manual Review"}</p>
                            <p>
                                Recommendation:
                                <strong>${report.recommendation}</strong>
                            </p>

                            <hr>
                            <h4>Pricing Agent</h4>
                            ${
                                pricingReport
                                    ? this.renderPricingHtml(pricingReport)
                                    : "<p>N/A — no cost data available from Shopify for this product.</p>"
                            }

                            <hr>
                            <h4>Content Creator</h4>
                            ${this.renderContentHtml(contentReport)}

                            <hr>
                            <h4>Social Media Agent</h4>
                            ${this.renderSocialHtml(socialPost)}

                            <hr>
                            <button
                                id="sendToQueueBtn"
                                data-id="${report.id}"
                            >
                                Send to Merchandise Director Queue
                            </button>
                        </div>
                    `;

                    const sendBtn =
                        document.getElementById("sendToQueueBtn");

                    if (sendBtn) {
                        sendBtn.addEventListener("click", () => {
                            Queue.add(report);
                            this.render();
                        });
                    }

                } catch (error) {
                    resultContainer.innerHTML = `
                        <div class="result-box">
                            <strong>Shopify Connection Error</strong>
                            <p>${error.message}</p>
                        </div>
                    `;
                }
            });

        document
            .getElementById("pricingForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const cost = Number(
                    document.getElementById("productCost").value
                );

                const margin = Number(
                    document.getElementById("targetMargin").value
                );

                const report = Pricing.calculate(cost, margin);

                document.getElementById("pricingResult").innerHTML = `
                    <div class="result-box">
                        ${this.renderPricingHtml(report)}
                    </div>
                `;
            });

        document
            .getElementById("contentForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const product = document
                    .getElementById("contentProduct")
                    .value
                    .trim();

                const report = Content.generate(product);

                document.getElementById("contentResult").innerHTML = `
                    <div class="result-box">
                        ${this.renderContentHtml(report)}
                    </div>
                `;
            });

        document
            .getElementById("socialForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                const product = document
                    .getElementById("socialProduct")
                    .value
                    .trim();

                const post = Social.generate(product);

                document.getElementById("socialResult").innerHTML = `
                    <div class="result-box">
                        ${this.renderSocialHtml(post)}
                    </div>
                `;
            });

        document
            .querySelectorAll(".approveQueueItem")
            .forEach(button => {
                button.addEventListener("click", () => {
                    Queue.approve(Number(button.dataset.id));
                    this.render();
                });
            });

        document
            .querySelectorAll(".rejectQueueItem")
            .forEach(button => {
                button.addEventListener("click", () => {
                    Queue.reject(Number(button.dataset.id));
                    this.render();
                });
            });

        document
            .querySelectorAll(".addQueueProduct")
            .forEach(button => {
                button.addEventListener("click", async () => {
                    const id = Number(button.dataset.id);
                    const item = Queue.find(id);

                    if (!item) {
                        return;
                    }

                    button.disabled = true;
                    button.textContent = "Creating in Shopify...";

                    try {
                        const response = await fetch("/api/create-product", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                title: item.product,
                                pillar: item.pillar,
                                descriptionHtml: item.contentReport?.longDescription || "",
                                seoTitle: item.contentReport?.seoTitle || item.product,
                                seoDescription: item.contentReport?.seoDescription || "",
                                price: item.pricingReport?.psychologicalPrice || null
                            })
                        });

                        const data = await response.json();

                        if (!data.success) {
                            alert(
                                "Shopify product creation failed: " +
                                (data.message || "Unknown error")
                            );
                            button.disabled = false;
                            button.textContent = "Add to Products";
                            return;
                        }

                        Queue.addToProducts(id, data.product.id);
                        this.render();

                    } catch (error) {
                        alert("Shopify product creation failed: " + error.message);
                        button.disabled = false;
                        button.textContent = "Add to Products";
                    }
                });
            });

        document
            .querySelectorAll(".removeQueueItem")
            .forEach(button => {
                button.addEventListener("click", () => {
                    Queue.remove(Number(button.dataset.id));
                    this.render();
                });
            });
    }

};
