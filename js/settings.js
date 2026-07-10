/*
==========================================
PLL MERCHANDISE DIRECTOR
Settings Module
==========================================
*/

const Settings = {

    init() {
        console.log("Settings Module Loaded");
    },

    load() {
        const saved = localStorage.getItem("pll-settings");

        if (saved) {
            PLL.state.settings = JSON.parse(saved);
        }

        return PLL.state.settings;
    },

    save(settings) {
        PLL.state.settings = settings;

        localStorage.setItem(
            "pll-settings",
            JSON.stringify(settings)
        );

        console.log("Settings Saved");
    }

};
