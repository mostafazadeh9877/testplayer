let instance = null;
module.exports = class SchedulingControllerClass {

    constructor() {
        this.ScheduleList = [];
    }

    addToScheduleList(singlePageScheduleList) {
        this.ScheduleList = this.ScheduleList.concat(singlePageScheduleList);
        this.sortScheduleList()
    }

    sortScheduleList() {
        this.ScheduleList.sort(((a, b) => a.sortElement - b.sortElement));
    }

    deleteFromScheduleListBy(divisionName, version) {
        this.scheduleList = this.ScheduleList.filter(function (ele) {
            return (ele.divisionName !== divisionName && ele.version !== version);
        });
    }

    static getInstance() {
        if (!instance) {
            instance = new SchedulingControllerClass();
        }

        return instance
    }
}
