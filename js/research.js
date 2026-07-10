/*
==========================================
PLL PRODUCT RESEARCH AGENT
Version 1.1
==========================================
*/

const Research = {

    reports: [],

    init() {
        console.log("Product Research Agent Loaded");
    },

    analyze(productName) {

        const report = {
            id: Date.now(),
            product: productName,
            supplier: "Pending",
            pillar: this.detectPillar(productName),

            demand: 75,
            competition: 50,
            profitMargin: 60,
            trendScore: this.randomScore(80,100),
            coachScore: this.randomScore(85,100),
            brandScore: this.randomScore(80,100),
            repeatPurchaseScore: this.randomScore(80,100),
            shippingScore: this.randomScore(75,100),

            pllScore: 0,
            recommendation: "",
            status: "Pending Review",
            approved: false
        };

        report.pllScore = this.calculatePLLScore(report);
        report.recommendation = this.recommend(report.pllScore);

        this.reports.push(report);

        return report;
    },

    detectPillar(productName){

        const name = productName.toLowerCase();

        if(name.includes("protein") ||
           name.includes("vitamin") ||
           name.includes("creatine"))
            return "FUEL";

        if(name.includes("journal") ||
           name.includes("sleep") ||
           name.includes("meditation"))
            return "FOCUS";

        return "TRAIN";

    },

    randomScore(min,max){
        return Math.floor(Math.random()*(max-min+1))+min;
    },

    calculatePLLScore(report){

        return Math.round(

            report.demand*.18+

            (100-report.competition)*.15+

            report.profitMargin*.18+

            report.trendScore*.12+

            report.coachScore*.10+

            report.brandScore*.10+

            report.repeatPurchaseScore*.10+

            report.shippingScore*.07

        );

    },

    recommend(score){

        if(score>=90) return "APPROVE";
        if(score>=80) return "STRONG CANDIDATE";
        if(score>=70) return "RESEARCH FURTHER";

        return "REJECT";

    },

    approve(id){

        const report=this.find(id);

        if(!report) return null;

        report.approved=true;
        report.status="Approved";

        return report;

    },

    reject(id){

        const report=this.find(id);

        if(!report) return null;

        report.approved=false;
        report.status="Rejected";

        return report;

    },

    find(id){

        return this.reports.find(
            report=>report.id===id
        );

    },

    getReports(){
        return this.reports;
    }

};
