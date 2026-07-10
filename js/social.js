/*
==========================================
PLL SOCIAL MEDIA AGENT
==========================================
*/

const Social = {

    posts: [],

    init() {
        console.log("Social Media Agent Loaded");
    },

    generate(product) {

        const post = {

            id: Date.now(),

            product,

            facebook:
                `Coach Marcus Pick 💪 ${product}\n\nUpgrade your TRAIN • FUEL • FOCUS journey.\n\n#PrimeLevelLiving`,

            instagram:
                `${product}\n\nCoach Approved.\n\n#PrimeLevelLiving #TrainFuelFocus #CoachMarcus`,

            x:
                `${product} is Coach Marcus Approved. #PrimeLevelLiving`,

            tiktok:
                `POV: You finally found the product Coach Marcus recommends. 🔥`

        };

        this.posts.push(post);

        return post;

    },

    getPosts() {

        return this.posts;

    }

};
