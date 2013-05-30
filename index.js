var util = require('util'),
  stream = require('stream'),
  exec = require('child_process').exec;

util.inherits(Driver,stream);
util.inherits(Device,stream);

function Driver(opts,app) {
  var self = this;

  app.on('client::up',function(){
    self.emit('register', new Device(app));
  });

}

var SunCalc = require('suncalc'),
    schedule = require('node-schedule'),
    _ = require('underscore'),
    colors = require('colors');
    moment = require('moment');

function Device(app) {
  var self = this;

  this._app = app;
  this.writeable = false;
  this.readable = true;
  this.V = 0;
  this.D = 14; // hid
  this.G = 'sun';
  this.name = 'Sun';

  setTimeout(function() {
    self.emit('data', 1); // Removeme!
  }, 1);

  function scheduleEvents() {
      self._app.log.info("☀ Scheduling the day's exciting sun-based events ☀".yellow);

      var now = new Date();

      var midnight = new Date();
      midnight.setHours(0,0,0,0);

      console.log('midnight', midnight.getTime());
      console.log('now', now.getTime());

      var times = SunCalc.getTimes(midnight, -33.8833, 151.2167);

      _.each(times, function(time, name) {
          self._app.log.debug(' - ', name.grey, 'is', moment(time).fromNow().red);

          schedule.scheduleJob(time, function(){
              self._app.log.info("🌅 IT'S.... ", name.green, "!!");
              self.emit('data', name);
          });
      });

      console.log('Scheduling next sun calc in ',  (midnight.getTime() + 1000 * 60 * 60 * 24) - now.getTime(), 'ms');

      setTimeout(scheduleEvents, (midnight.getTime() + 1000 * 60 * 60 * 24) - now.getTime());
  }

  scheduleEvents();
}


module.exports = Driver;
