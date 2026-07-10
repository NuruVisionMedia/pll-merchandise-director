/*
==========================================
PLL MERCHANDISE DIRECTOR
Settings Module
==========================================
*/

const Settings = {

    storageKey: "pll-settings",

    defaults: {
        company: "Prime Level Living",
        aiModel: "Claude",
        theme: "dark",
        autoScoreProducts: true,
        autoGenerateSEO: true,
        autoGenerateCoachReview: true
    },

    init() {
        console.log("Settings Module Loaded");
        this.load();
    },

    load() {

        const saved = localStorage.getItem(this.storageKey);

        if (saved) {
            PLL.state.settings = JSON.parse(saved);
        } else {
            PLL.state.settings = { ...this.defaults };
            this.save();
        }

        return PLL.state.settings;

    },

    save() {

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(PLL.state.settings)
        );

    },

    reset() {

        PLL.state.settings = { ...this.defaults };

        this.save();

    }

};
