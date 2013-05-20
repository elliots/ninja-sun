var SunCalc = require('suncalc'),
    schedule = require('node-schedule'),
    _ = require('underscore'),
    colors = require('colors');
    moment = require('moment');

function scheduleEvents() {
    console.log("☀ Scheduling the day's exciting sun-based events ☀".yellow);

    var now = new Date();
    var times = SunCalc.getTimes(new Date(), -33.8833, 151.2167);

    _.each(times, function(time, name) {
        console.log(' - ', name.grey, 'is', moment(time).fromNow().red);

        schedule.scheduleJob(time, function(){
            console.log("🌅 IT'S.... ", name.green, "!!");
        });
    });

    setTimeout(scheduleEvents, 1000 * 60 * 60 * 24);
}

scheduleEvents();
