const os = require("os");

//Create function to get CPU information
function cpuAverage() {

  //Initialise sum of idle and time of cores and fetch CPU info
  var totalIdle = 0, totalTick = 0;
  var cpus = os.cpus();

  //Loop through CPU cores
  for (var i = 0, len = cpus.length; i < len; i++) {

    //Select CPU core
    var cpu = cpus[i];

    //Total up the time in the cores tick
    for (type in cpu.times) {
      totalTick += cpu.times[type];
    }

    //Total up the idle time of the core
    totalIdle += cpu.times.idle;
  }

  //Return the average Idle and Tick times
  return {idle: totalIdle / cpus.length, total: totalTick / cpus.length};
}


module.exports.cpuAverage = cpuAverage;

// function to calculate average of array
const arrAvg = function (arr) {
  if (arr && arr.length >= 1) {
    const sumArr = arr.reduce((a, b) => a + b, 0)
    return sumArr / arr.length;
  }
};

module.exports.arrAvg = arrAvg;
// load average for the past 1000 milliseconds calculated every 100
function getCPULoadAVG(avgTime = 1000, delay = 100) {

  return new Promise((resolve, reject) => {

    const n = ~~(avgTime / delay);
    if (n <= 1) {
      reject('Error: interval to small');
    }

    let i = 0;
    let samples = [];
    const avg1 = cpuAverage();

    let interval = setInterval(() => {
      console.debug('CPU Interval: ', i);

      if (i >= n) {
        clearInterval(interval);
        resolve(~~((arrAvg(samples) * 100)));
      }

      const avg2 = cpuAverage();
      const totalDiff = avg2.total - avg1.total;
      const idleDiff = avg2.idle - avg1.idle;

      samples[i] = (1 - idleDiff / totalDiff);

      i++;

    }, delay);

  });

}

module.exports.getCPULoadAVG = getCPULoadAVG;


/*
* Usage:
* cpuusage.getCPULoadAVG(1000, 100).then((avg) => {
*   console.log(avg);
* });
*/
