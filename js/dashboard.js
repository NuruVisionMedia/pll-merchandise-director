/*
==========================================
PLL AI OPERATIONS
Dashboard Module
==========================================
*/

const Dashboard = {

    queueFilters: {
        search: "",
        pillar: "",
        status: ""
    },

    auditResults: [],
    auditRunning: false,

    init() {
        Queue.init();
        this.render();
    },

    getFilteredQueueItems() {
        const search = this.queueFilters.search.trim().toLowerCase();
        const pillar = this.queueFilters.pillar;
        const status = this.queueFilters.status;

        return Queue.list().filter(item => {
            const matchesSearch =
                !search || item.product.toLowerCase().includes(search);

            const matchesPillar =
                !pillar || item.pillar === pillar;

            const matchesStatus =
                !status || item.status === status;

            return matchesSearch && matchesPillar && matchesStatus;
        });
    },

    renderQueueItemsHtml(items) {
        if (!items.length) {
            return "<p>No products match the current filters.</p>";
        }

        return items.map(item => `
            <div class="product-row">
                <div>
                    <strong>${item.product}</strong>
                    <span>Pillar: ${item.pillar}</span>
                    <span>PLL Score: ${item.pllScore ?? "Needs Manual Review"}</span>
                    <span>Recommendation: ${item.recommendation}</span>
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
                        item.status !== "Rejected by Merchandise Director"
                            ? `
                                <button class="approveQueueItem" data-id="${item.id}">
                                    Approve
                                </button>
                                <button class="rejectQueueItem" data-id="${item.id}">
                                    Reject
                                </button>
                            `
                            : ""
                    }

                    ${
                        item.approved && !item.addedToProducts
                            ? `
                                <button class="addQueueProduct" data-id="${item.id}">
                                    Add to Products
                                </button>
                            `
                            : ""
                    }

                    <button class="removeQueueItem" data-id="${item.id}">
                        Remove
                    </button>
                </div>
            </div>
        `).join("");
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

    describeIssues(issues) {
        const labels = {
            missingDescription: "Missing description",
            missingSEO: "Missing SEO title/description",
            missingCost: "No cost data (margin can't be calculated)",
            zeroPrice: "Price is $0.00 (needs manual pricing)"
        };

        return issues.map(issue => labels[issue] || issue).join(", ");
    },

    renderAuditResultsHtml() {
        if (this.auditRunning) {
            return "<p>Scanning your live Shopify catalog...</p>";
        }

        if (!this.auditResults.length) {
            return "<p>No audit results yet. Click \"Scan Catalog\" to check your live products for gaps.</p>";
        }

        const pending = this.auditResults.filter(item => !item.fixed && !item.skipped);

        if (!pending.length) {
            return "<p>All flagged issues have been addressed or skipped.</p>";
        }

        return pending.map(item => `
            <div class="product-row">
                <div>
                    <strong>${item.title}</strong>
                    <span>Issues: ${this.describeIssues(item.issues)}</span>
                    ${
                        item.issues.includes("zeroPrice")
                            ? "<span><em>Price needs manual attention — no automatic fix suggested.</em></span>"
                            : ""
                    }
                    ${
                        item.issues.includes("missingCost")
                            ? "<span><em>Cost data missing — add via Shopify Inventory settings to enable margin tracking.</em></span>"
                            : ""
                    }
                    ${
                        item.proposedDescription
                            ? `<span><strong>Proposed Description:</strong> ${item.proposedDescription}</span>`
                            : ""
                    }
                    ${
                        item.proposedSeoTitle
                            ? `<span><strong>Proposed SEO Title:</strong> ${item.proposedSeoTitle}</span>`
                            : ""
                    }
                    ${
                        item.proposedSeoDescription
                            ? `<span><strong>Proposed SEO Description:</strong> ${item.proposedSeoDescription}</span>`
                            : ""
                    }
                </div>

                <div class="queue-actions">
                    ${
                        (item.proposedDescription || item.proposedSeoTitle)
                            ? `<button class="approveAuditFix" data-id="${item.productId}">Approve Fix</button>`
                            : ""
                    }
                    <button class="skipAuditItem" data-id="${item.productId}">Skip</button>
                </div>
            </div>
        `).join("");
    },

    render() {
        const app = document.getElementById("app");

        if (!app) {
            throw new Error("Application root not found.");
        }

        const settings = PLL.state.settings || Settings.defaults;

        app.innerHTML = `
            <div class="container">

                <div class="card">
                    <h1>PLL AI Operations</h1>
                    <p>Support Agents for the PLL Merchandise Director</p>
                </div>

                <div class="card">
                    <h3>Catalog Audit</h3>
                    <p>Scans your live Shopify catalog for products missing descriptions, SEO, cost data, or pricing. Proposed fixes require your approval before anything is written back to Shopify.</p>

                    <button id="runAuditBtn" ${this.auditRunning ? "disabled" : ""}>
                        ${this.auditRunning ? "Scanning..." : "Scan Catalog"}
                    </button>

                    <div id="auditResults">
                        ${this.renderAuditResultsHtml()}
                    </div>
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
                            value="${settings.defaultTargetMargin}"
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

                    <div class="queue-filters">
                        <input
                            id="queueSearch"
                            type="text"
                            placeholder="Search by product name"
                            value="${this.queueFilters.search}"
                        >

                        <select id="queuePillarFilter">
                            <option value="">All Pillars</option>
                            <option value="TRAIN" ${this.queueFilters.pillar === "TRAIN" ? "selected" : ""}>TRAIN</option>
                            <option value="FUEL" ${this.queueFilters.pillar === "FUEL" ? "selected" : ""}>FUEL</option>
                            <option value="FOCUS" ${this.queueFilters.pillar === "FOCUS" ? "selected" : ""}>FOCUS</option>
                        </select>

                        <select id="queueStatusFilter">
                            <option value="">All Statuses</option>
                            <option value="Pending Merchandise Director Review" ${this.queueFilters.status === "Pending Merchandise Director Review" ? "selected" : ""}>Pending Review</option>
                            <option value="Approved by Merchandise Director" ${this.queueFilters.status === "Approved by Merchandise Director" ? "selected" : ""}>Approved</option>
                            <option value="Rejected by Merchandise Director" ${this.queueFilters.status === "Rejected by Merchandise Director" ? "selected" : ""}>Rejected</option>
                            <option value="Created in Shopify" ${this.queueFilters.status === "Created in Shopify" ? "selected" : ""}>Created in Shopify</option>
                        </select>
                    </div>

                    <div id="queueList">
                        ${this.renderQueueItemsHtml(this.getFilteredQueueItems())}
                    </div>
                </div>

                <div class="card">
                    <h3>Settings</h3>

                    <form id="settingsForm">
                        <label>
                            Company Name
                            <input id="settingsCompany" type="text" value="${settings.company}">
                        </label>

                        <label>
                            AI Model
                            <input id="settingsAiModel" type="text" value="${settings.aiModel}" readonly>
                        </label>

                        <label>
                            <input type="checkbox" id="settingsAutoScore" ${settings.autoScoreProducts ? "checked" : ""}>
                            Auto-score products
                        </label>

                        <label>
                            <input type="checkbox" id="settingsAutoSEO" ${settings.autoGenerateSEO ? "checked" : ""}>
                            Auto-generate SEO
                        </label>

                        <label>
                            <input type="checkbox" id="settingsAutoCoach" ${settings.autoGenerateCoachReview ? "checked" : ""}>
                            Auto-generate Coach Review
                        </label>

                        <label>
                            Default Target Margin (%)
                            <input
                                id="settingsDefaultMargin"
                                type="number"
                                min="1"
                                max="95"
                                value="${settings.defaultTargetMargin}"
                            >
                        </label>

                        <button type="submit">Save Settings</button>
                    </form>

                    <div id="settingsSavedMessage"></div>
                </div>

            </div>
        `;

        this.attachEvents();
    },

    updateQueueList() {
        const container = document.getElementById("queueList");

        if (!container) {
            return;
        }

        container.innerHTML = this.renderQueueItemsHtml(this.getFilteredQueueItems());
        this.attachQueueItemEvents();
    },

    updateAuditResults() {
        const container = document.getElementById("auditResults");

        if (!container) {
            return;
        }

        container.innerHTML = this.renderAuditResultsHtml();
        this.attachAuditItemEvents();
    },

    attachQueueItemEvents() {
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
    },

    attachAuditItemEvents() {
        document
            .querySelectorAll(".approveAuditFix")
            .forEach(button => {
                button.addEventListener("click", async () => {
                    const productId = button.dataset.id;
                    const item = this.auditResults.find(r => r.productId === productId);

                    if (!item) {
                        return;
                    }

                    button.disabled = true;
                    button.textContent = "Applying...";

                    try {
                        const response = await fetch("/api/update-product", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                productId: item.productId,
                                descriptionHtml: item.proposedDescription || undefined,
                                seoTitle: item.proposedSeoTitle || undefined,
                                seoDescription: item.proposedSeoDescription || undefined
                            })
                        });

                        const data = await response.json();

                        if (!data.success) {
                            alert("Update failed: " + (data.message || "Unknown error"));
                            button.disabled = false;
                            button.textContent = "Approve Fix";
                            return;
                        }

                        item.fixed = true;
                        this.updateAuditResults();

                    } catch (error) {
                        alert("Update failed: " + error.message);
                        button.disabled = false;
                        button.textContent = "Approve Fix";
                    }
                });
            });

        document
            .querySelectorAll(".skipAuditItem")
            .forEach(button => {
                button.addEventListener("click", () => {
                    const productId = button.dataset.id;
                    const item = this.auditResults.find(r => r.productId === productId);

                    if (item) {
                        item.skipped = true;
                    }

                    this.updateAuditResults();
                });
            });
    },

    attachEvents() {
        document
            .getElementById("runAuditBtn")
            .addEventListener("click", async () => {
                this.auditRunning = true;
                this.auditResults = [];
                this.updateAuditResults();

                const btn = document.getElementById("runAuditBtn");
                if (btn) {
                    btn.disabled = true;
                    btn.textContent = "Scanning...";
                }

                try {
                    const products = await Shopify.getProducts();

                    const results = products.map(product => {
                        const variants = Array.isArray(product.variants?.nodes)
                            ? product.variants.nodes
                            : [];

                        const firstVariant = variants[0] || {};

                        const description = (product.descriptionHtml || "")
                            .replace(/<[^>]*>/g, "")
                            .trim();

                        const hasSEO =
                            product.seo?.title && product.seo?.description;

                        const hasCost = variants.some(v =>
                            Number.isFinite(Number(v.inventoryItem?.unitCost?.amount)) &&
                            Number(v.inventoryItem?.unitCost?.amount) > 0
                        );

                        const price = Number(firstVariant.price);

                        const issues = [];

                        if (description.length < 20) {
                            issues.push("missingDescription");
                        }

                        if (!hasSEO) {
                            issues.push("missingSEO");
                        }

                        if (!hasCost) {
                            issues.push("missingCost");
                        }

                        if (!Number.isFinite(price) || price <= 0) {
                            issues.push("zeroPrice");
                        }

                        if (!issues.length) {
                            return null;
                        }

                        let proposedDescription = "";
                        let proposedSeoTitle = "";
                        let proposedSeoDescription = "";

                        if (issues.includes("missingDescription") || issues.includes("missingSEO")) {
                            const contentReport = Content.generate(product.title);

                            if (issues.includes("missingDescription")) {
                                proposedDescription = contentReport.longDescription;
                            }

                            if (issues.includes("missingSEO")) {
                                proposedSeoTitle = contentReport.seoTitle;
                                proposedSeoDescription = contentReport.seoDescription;
                            }
                        }

                        return {
                            productId: product.id,
                            title: product.title,
                            issues,
                            proposedDescription,
                            proposedSeoTitle,
                            proposedSeoDescription,
                            variantId: firstVariant.id || null,
                            currentPrice: price,
                            fixed: false,
                            skipped: false
                        };
                    }).filter(Boolean);

                    this.auditResults = results;

                } catch (error) {
                    alert("Catalog audit failed: " + error.message);
                } finally {
                    this.auditRunning = false;
                    this.updateAuditResults();

                    const finishedBtn = document.getElementById("runAuditBtn");
                    if (finishedBtn) {
                        finishedBtn.disabled = false;
                        finishedBtn.textContent = "Scan Catalog";
                    }
                }
            });

        this.attachAuditItemEvents();

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

                    const settings = PLL.state.settings || Settings.defaults;

                    const contentReport = Content.generate(report.product);
                    const socialPost = Social.generate(report.product);
                    const pricingReport = report.averageCost !== null
                        ? Pricing.calculate(report.averageCost, settings.defaultTargetMargin || 50)
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
                            <button id="sendToQueueBtn" data-id="${report.id}">
                                Send to Merchandise Director Queue
                            </button>
                        </div>
                    `;

                    const sendBtn = document.getElementById("sendToQueueBtn");

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

        const queueSearchInput = document.getElementById("queueSearch");
        const queuePillarFilter = document.getElementById("queuePillarFilter");
        const queueStatusFilter = document.getElementById("queueStatusFilter");

        if (queueSearchInput) {
            queueSearchInput.addEventListener("input", () => {
                this.queueFilters.search = queueSearchInput.value;
                this.updateQueueList();
            });
        }

        if (queuePillarFilter) {
            queuePillarFilter.addEventListener("change", () => {
                this.queueFilters.pillar = queuePillarFilter.value;
                this.updateQueueList();
            });
        }

        if (queueStatusFilter) {
            queueStatusFilter.addEventListener("change", () => {
                this.queueFilters.status = queueStatusFilter.value;
                this.updateQueueList();
            });
        }

        this.attachQueueItemEvents();

        document
            .getElementById("settingsForm")
            .addEventListener("submit", event => {
                event.preventDefault();

                PLL.state.settings.company =
                    document.getElementById("settingsCompany").value.trim();

                PLL.state.settings.autoScoreProducts =
                    document.getElementById("settingsAutoScore").checked;

                PLL.state.settings.autoGenerateSEO =
                    document.getElementById("settingsAutoSEO").checked;

                PLL.state.settings.autoGenerateCoachReview =
                    document.getElementById("settingsAutoCoach").checked;

                PLL.state.settings.defaultTargetMargin =
                    Number(document.getElementById("settingsDefaultMargin").value) || 50;

                Settings.save();

                const savedMessage = document.getElementById("settingsSavedMessage");

                if (savedMessage) {
                    savedMessage.textContent = "Settings saved.";
                    setTimeout(() => {
                        savedMessage.textContent = "";
                    }, 2000);
                }
            });
    }

};
