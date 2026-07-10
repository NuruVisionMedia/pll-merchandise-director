/*
==========================================
PLL SOCIAL MEDIA AGENT
Version 1.1
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
`🔥 Coach Marcus Pick

${product}

Performance isn't accidental.
It's intentional.

#PrimeLevelLiving
#CoachMarcus
#TrainFuelFocus`,

            instagram:
`${product}

Chosen by Coach Marcus to elevate your next level.

#PrimeLevelLiving
#CoachMarcus
#TrainFuelFocus
#PerformanceLifestyle`,

            x:
`Coach Marcus recommends ${product}.

#PrimeLevelLiving`,

            tiktok:
`Coach Marcus just approved this product.

Would you add it to your gym?

#PrimeLevelLiving`,

            youtube:
`Coach Marcus Product Review:
${product}`

        };

        this.posts.push(post);

        return post;

    },

    getPosts() {

        return this.posts;

    }

};
