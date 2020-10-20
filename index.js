// const SinglePageCreatorClass = require('./baseClass/SinglePageCreatorClass');
// const SchedulingControllerClass = require('./baseClass/SchedlingControllerClass');
// const SinglePageHolderClass = require('./baseClass/SinglePageHolderClass');
//
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io').listen(http);
require('dotenv').config();

app.get('/:divisionName/:version', (req, res) => {
    let divisionName = req.params.divisionName;
    let version = req.params.version;
    app.use(express.static("Divisions"));
    res.sendFile("index.html", {root: path.join(__dirname, "./Divisions", divisionName, version)});
});

io.on('connection', function (socket) {
    console.log('create a new connection');
    let now = new Date().getTime();
    const scheduleList = [
        {
            url: "http://localhost:3000/first/1.0.0/",
            date: "yyyy/mm/dd",
            start: now,
            end: now+60000,
        },{
            url: "http://localhost:3000/secondDivision/2.0.0/",
            date: "yyyy/mm/dd",
            start: now+60000,
            end: now+120000,
        },{
            url: "http://localhost:3000/first/1.0.0/",
            date: "yyyy/mm/dd",
            start: now+120000,
            end: now+180000,
        },{
            url: "http://localhost:3000/secondDivision/2.0.0/",
            date: "yyyy/mm/dd",
            start: now+180000,
            end: now+240000,
        }
    ];
    io.emit("newScheduleList",scheduleList);
});

http.listen(process.env.PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log("listening on port " + process.env.PORT);
});
