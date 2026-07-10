/*
==========================================
PLL CONTENT CREATOR
Version 1.1
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

            product,

            headline: `Upgrade Your Performance With ${product}`,

            shortDescription:
                `${product} has been selected by Coach Marcus to support your Prime Level Living journey.`,

            longDescription:
                `${product} is a Coach-selected recommendation designed to help you TRAIN harder, FUEL smarter, and maintain FOCUS every day.`,

            bullets: [
                "Coach Selected",
                "Premium Quality",
                "Supports Peak Performance",
                "Ideal for Prime Level Living"
            ],

            callToAction:
                "Shop Coach Pick",

            seoTitle:
                `${product} | Prime Level Living`,

            seoDescription:
                `Discover why Coach Marcus recommends ${product} to support your TRAIN • FUEL • FOCUS lifestyle.`,

            hashtags: [
                "#PrimeLevelLiving",
                "#CoachMarcus",
                "#TrainFuelFocus",
                "#PerformanceLifestyle"
            ]

        };

        this.reports.push(report);

        return report;

    },

    getReports() {

        return this.reports;

    }

};
