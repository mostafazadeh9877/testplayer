let instance = null;
module.exports = class SinglePageHolderClass {

    constructor() {
        this.SinglePageList = [];
    }

    addSinglePage(singlePage) {
        this.SinglePageList.push(singlePage);
    }

    getSinglePage(){
        return this.SinglePageList;
    }

    static getInstance() {
        if (!instance) {
            instance = new SinglePageHolderClass();
        }
        return instance;
    }
}