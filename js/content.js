/*
==========================================
PLL CONTENT CREATOR
==========================================
*/

const Content = {

    reports: [],

    init() {
        console.log("Content Creator Loaded");
    },

    generate(product) {

        const report = {

            id: Date.now(),

            title: product,

            headline: `Upgrade Your Performance With ${product}`,

            shortDescription:
                `${product} has been selected by Coach Marcus to help support your Prime Level Living journey.`,

            callToAction:
                "Shop Coach Pick",

            seoTitle:
                `${product} | Prime Level Living`,

            seoDescription:
                `Discover why Coach Marcus recommends ${product} for your TRAIN • FUEL • FOCUS journey.`

        };

        this.reports.push(report);

        return report;

    },

    getReports() {

        return this.reports;

    }

};
