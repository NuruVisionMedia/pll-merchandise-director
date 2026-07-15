/*
==========================================
PLL MERCHANDISE DIRECTOR
Dashboard Module
==========================================
*/

const Dashboard = {

    init() {
        console.log("Dashboard Module Loaded");

        document
            .getElementById("researchForm")
            .addEventListener("submit", async event => {
                event.preventDefault();

                const productName = document
                    .getElementById("researchProduct")
                    .value
                    .trim();

                const resultContainer =
                    document.getElementById("researchResult");

                resultContainer.innerHTML = `
                    <div class="result-box">
                        <p>Searching the live Shopify store...</p>
                    </div>
                `;

                try {
                    const report = await Research.analyze(productName);

                    if (!report.found) {
                        resultContainer.innerHTML = `
                            <div class="result-box">
                                <strong>Product Not Found</strong>
                                <p>${report.message}</p>
                            </div>
                        `;
                        return;
                    }

                    const priceDisplay =
                        report.minimumPrice === report.maximumPrice
                            ? `$${report.minimumPrice.toFixed(2)}`
                            : `$${report.minimumPrice.toFixed(2)} – $${report.maximumPrice.toFixed(2)}`;

                    resultContainer.innerHTML = `
                        <div class="result-box">

                            ${
                                report.imageUrl
                                    ? `
                                        <img
                                            src="${report.imageUrl}"
                                            alt="${report.product}"
                                            style="max-width:180px; border-radius:8px; margin-bottom:15px;"
                                        >
                                    `
                                    : ""
                            }

                            <h4>${report.product}</h4>

                            <p><strong>Source:</strong> ${report.source}</p>
                            <p><strong>Vendor:</strong> ${report.vendor}</p>
                            <p><strong>Product Type:</strong> ${report.productType}</p>
                            <p><strong>Status:</strong> ${report.status}</p>
                            <p><strong>Total Inventory:</strong> ${report.totalInventory}</p>
                            <p><strong>Variants:</strong> ${report.variantCount}</p>
                            <p><strong>Price:</strong> ${priceDisplay}</p>
                            <p>
                                <strong>SKUs:</strong>
                                ${report.skuList.length
                                    ? report.skuList.join(", ")
                                    : "No SKUs assigned"}
                            </p>

                        </div>
                    `;

                } catch (error) {
                    resultContainer.innerHTML = `
                        <div class="result-box">
                            <strong>Shopify Connection Error</strong>
                            <p>${error.message}</p>
                        </div>
                    `;
                }
            });
    }

};
