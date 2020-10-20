const fs = require('fs');
const path = require('path');
const download = require('download-file');
const divisionsFolder = "Divisions";

module.exports = class SinglePageCreatorClass {

    constructor(divisionName, version) {
        this.divisionName = divisionName;
        this.version = version;
        this.specificDivisionFolder = divisionsFolder + "/" + this.divisionName;
        this.specificVersionFolder = this.specificDivisionFolder + "/" + this.version;
        this.assetFolder = this.specificVersionFolder + "/asset";
        this.schedulList = [];
    }

    Create() {
        // this.CreateFolderByDivisionNameAndVersionInLocal();
        // this.DownloadTemplateAndSchedulingFile();
        // this.ExtractSchedulingFromJsonFile();
        // this.DownloadAssetFiles();
        // this.InjectComponentIntoTemplate();
    }

    CreateFolderByDivisionNameAndVersionInLocal() {

        try {
            if (!fs.existsSync(divisionsFolder)) {
                fs.mkdirSync(divisionsFolder);
            }
            if (!fs.existsSync(this.specificDivisionFolder)) {
                fs.mkdirSync(this.specificDivisionFolder);
            }
            if (!fs.existsSync(this.specificVersionFolder)) {
                fs.mkdirSync(this.specificVersionFolder);
                fs.mkdirSync(this.assetFolder);
                fs.mkdirSync(this.assetFolder + "/js");
                fs.mkdirSync(this.assetFolder + "/stylesheet");
                fs.mkdirSync(this.assetFolder + "/img");
                fs.mkdirSync(this.assetFolder + "/video");
            }

        } catch (err) {
            console.log(err);
        }
    }

    DownloadTemplateAndSchedulingFile() {
        let url = "http://url/access/" + this.divisionName + "/" + this.version;
        this.Download(url, this.specificVersionFolder + "/", "scheduling.json");
        this.Download(url, this.specificVersionFolder + "/", "index.html");
    }

    ExtractSchedulingFromJsonFile() {
        let jsonFile = JSON.parse(fs.readFileSync(path.resolve(this.specificVersionFolder, "scheduling.json"), "utf-8"));
        for (let s of jsonFile.scheduling) {
            this.createScheduleListFormatAndPushToIt(s);
        }
    }

    createScheduleListFormatAndPushToIt(s) {
        let startDate = s.start.split("T")[0];
        let endDate = s.end.split("T")[0];
        let startTime = s.start.split("T")[1].split("Z")[0];
        let endTime = s.end.split("T")[1].split("Z")[0];
        let numberOfDay = this.numberOfDayBetweenStartAndEnd(startDate, endDate);
        this.schedulList.push(
            {
                divisionName: this.divisionName,
                version: this.version,
                sortElement:s.start(),
                Date: startDate,
                startTime: startTime,
                endTime: numberOfDay === 0 ? endTime : "23:59:59"
            });
        if (numberOfDay > 0) {
            for (let i = 1; i <= numberOfDay; i++) {
                let nextDate = this.getNextDate(startDate, i)
                this.schedulList.push(
                    {
                        divisionName: this.divisionName,
                        version: this.version,
                        sortElement:new Date(nextDate+"T00:00:00Z").toISOString(),
                        Date: nextDate,
                        startTime: "00:00:00",
                        endTime: i === numberOfDay ? endTime : "00:00:00"
                    });
            }
        }
        return i;
    }

    numberOfDayBetweenStartAndEnd(start, end) {
        let startDate = new Date(start);
        let endDate = new Date(end);
        return ((endDate - startDate) / (1000 * 3600 * 24));
    }

    getNextDate(today, i) {
        return new Date(today.getFullYear() + "-" + today.getMonth() + "-" + (today.getDate() + i))
            .toISOString().split("T")[0];
    }

    DownloadAssetFiles() {
        this.DownloadMediaFile();
        this.DownloadStyleAndJsFile();
    }

    DownloadMediaFile() {
        let jsonFile = JSON.parse(fs.readFileSync(path.resolve(this.specificVersionFolder, "scheduling.json"), "utf-8"));
        for (c of jsonFile.components) {
            switch (c.componentId) {
                case "IMAGEVIEW":
                    this.DownloadImage(c.src);
                    break;
                case "VIDEOVIEW":
                    this.DownloadVideo(c.src);
                    break;
            }
        }
    }

    Download(url, directory, fileName) {
        let options = {
            directory: directory,
            fileName: fileName
        }

        download(url, options, function (err) {
            if (err) return console.log(err);
            console.log(fileName + " download from :'" + url + "' and save in to :'" + directory + "'");
        })
    }

    DownloadImage(src) {
        let directory = this.assetFolder + "/img";
        let fileName = src.substring(src.lastIndexOf('/') + 1, src.length);
        this.Download(src, directory, fileName);
    }

    DownloadVideo(src) {
        let directory = this.assetFolder + "/video";
        let fileName = src.substring(src.lastIndexOf('/') + 1, src.length);
        this.Download(src, directory, fileName);
    }

    DownloadStyleAndJsFile() {
        let htmlFile = fs.readFileSync(path.resolve(this.specificVersionFolder, "index.html"), "utf-8");
        //TODO
    }

    InjectComponentIntoTemplate() {
        let jsonFile = JSON.parse(fs.readFileSync(path.resolve(this.specificVersionFolder, "scheduling.json"), "utf-8"));
    }
}