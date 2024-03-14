let white = getComputedStyle(document.documentElement).getPropertyValue('--white');
let black = getComputedStyle(document.documentElement).getPropertyValue('--black');
let lightgrey = getComputedStyle(document.documentElement).getPropertyValue('--light-grey');
let darkgrey = getComputedStyle(document.documentElement).getPropertyValue('--dark-grey');
document.getElementById('progressNotices').style.animation = 'none';

let updateInterval = 1000;
let maxBedValue = -1;
let maxNozzleValue = -1;

const portNum = 8002;

let canvas = document.getElementById('bedChart');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas = document.getElementById('darkBedChart');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas = document.getElementById('nozzleChart');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas = document.getElementById('darkNozzleChart');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const bedHeating1 = document.getElementById('bedHeating1');
const bedHeating2 = document.getElementById('bedHeating2');
const bedHeating3 = document.getElementById('bedHeating3');
const bedHeating4 = document.getElementById('bedHeating4');
const bedHeating5 = document.getElementById('bedHeating5');
let bedIntervalId;

const nozzleHeating1 = document.getElementById('nozzleHeating1');
const nozzleHeating2 = document.getElementById('nozzleHeating2');
const nozzleHeating3 = document.getElementById('nozzleHeating3');
const nozzleHeating4 = document.getElementById('nozzleHeating4');
const nozzleHeating5 = document.getElementById('nozzleHeating5');
let nozzleIntervalId;

const xValues = [];
const bedyValues = [];
const nozzleyValues = [];
for (let i = 0; i < 20; i++) {
  xValues.push(i * (updateInterval / 1000));
  bedyValues.push(0);
  nozzleyValues.push(0);
}

let bedChart = new Chart("bedChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      borderColor: white,
      data: bedyValues,
      tension: 0,
      pointRadius: 0,
      fill: false,
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 0,
          max: 100,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (y-axis line)
          color: white,
          lineWidth: 5,
        }
      }],
      xAxes: [{
        ticks: {
          display: false,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (x-axis line)
          color: white,
          lineWidth: 5,
        }
    }],
  }
}
});

let darkBedChart = new Chart("darkBedChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      borderColor: darkgrey,
      data: bedyValues,
      tension: 0,
      pointRadius: 0,
      fill: false,
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 0,
          max: 100,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (y-axis line)
          color: darkgrey,
          lineWidth: 5,
        }
      }],
      xAxes: [{
        ticks: {
          display: false,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (x-axis line)
          color: darkgrey,
          lineWidth: 5,
        }
    }],
  }
}
});

let nozzleChart = new Chart("nozzleChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      borderColor: white,
      data: nozzleyValues,
      tension: 0,
      pointRadius: 0,
      fill: false,
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 0,
          max: 100,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (y-axis line)
          color: white,
          lineWidth: 5,
        }
      }],
      xAxes: [{
        ticks: {
          display: false,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (x-axis line)
          color: white,
          lineWidth: 5,
        }
    }],
  }
}
});

let darkNozzleChart = new Chart("darkNozzleChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      borderColor: darkgrey,
      data: nozzleyValues,
      tension: 0,
      pointRadius: 0,
      fill: false,
    }]
  },
  options: {
    legend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          display: false,
          min: 0,
          max: 100,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (y-axis line)
          color: darkgrey,
          lineWidth: 5,
        }
      }],
      xAxes: [{
        ticks: {
          display: false,
        },
        gridLines: {
          drawTicks: false,
          drawOnChartArea: false, // don't draw grid lines in the chart area
          drawBorder: true, // do draw the border line (x-axis line)
          color: darkgrey,
          lineWidth: 5,
        }
    }],
  }
}
});

let getJobStatic = () => {
  // Run once on startup
  fetch(`http://127.0.0.1:${portNum}/job`)
    .then(response => response.json())
    .then(data => {
      let fileName = data.file.display_name.split('_');
      checkLength(checkIS(fileName)[0]);
      document.getElementById('filamentType').textContent = fileName[3];
      document.getElementById('layerHeight').textContent = fileName[2].replace('mm', '');
      document.getElementById('layerUnit').textContent = 'mm';
      document.getElementById('nozzleDiameter').textContent = fileName[1].replace('n', '');
      document.getElementById('nozzleUnit').textContent = 'mm';
      document.getElementById('timeString').innerHTML = calcTime(fileName[5].split('.')[0]);
    })
    .catch(error => {});
}

let getJobDynamic = () => {
  // Run in loop
  fetch(`http://127.0.0.1:${portNum}/job`)
    .then(response => response.json())
    .then(data => {
      updateProgressBar(data.progress);
      updateProgressNotices(data);
      shrinkText('timeRemaining');
      shrinkText('timeElapsed');
    })
    .catch(error => {});
}

let getInfo = () => {
  // Run once on startup
  fetch(`http://127.0.0.1:${portNum}/info`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('printerName').textContent = data.name;
      document.getElementById('firmwareVersion').textContent = 'FW ' + data.firmware;
    })
    .catch(error => {});
}

let getStatus = (callback) => {
  // Run in loop
  fetch(`http://127.0.0.1:${portNum}/status`)
  .then(response => response.json())
  .then(data => {
    document.getElementById('hotendFan').textContent = data.printer.fan_hotend;
    document.getElementById('speed').textContent = Math.ceil(data.printer.speed) + '%';
    document.getElementById('printFan').textContent = data.printer.fan_print;

    document.getElementById('nozzleTemp').textContent = Math.ceil(data.printer.temp_nozzle) + '°';
    document.getElementById('darkNozzleTemp').textContent = Math.ceil(data.printer.temp_nozzle) + '°';

    document.getElementById('bedTemp').textContent = Math.ceil(data.printer.temp_bed) + '°';
    document.getElementById('darkBedTemp').textContent = Math.ceil(data.printer.temp_bed) + '°';

    document.getElementById('nozzleTarget').textContent = '/ ' + Math.ceil(data.printer.target_nozzle) + '°';
    document.getElementById('darkNozzleTarget').textContent = '/ ' + Math.ceil(data.printer.target_nozzle) + '°';

    document.getElementById('bedTarget').textContent = '/ ' + Math.ceil(data.printer.target_bed) + '°';
    document.getElementById('darkBedTarget').textContent = '/ ' + Math.ceil(data.printer.target_bed) + '°';

    checkNozzleHeating(data.printer.temp_nozzle, data.printer.target_nozzle);
    checkBedHeating(data.printer.temp_bed, data.printer.target_bed);
    updateNozzleGraph(data.printer.temp_nozzle);
    updateBedGraph(data.printer.temp_bed);
    callback(data.printer.state);
  })
  .catch(error => {
    callback("IDLE");
  });
}

let getThumbnail = () => {
  // Run once on startup
  fetch(`http://127.0.0.1:${portNum}/thumbnail`)
    .then(response => response.blob())
    .then(blob => {
        let view = document.getElementById('thumbnail');
        let image = URL.createObjectURL(blob);
        let size = new Image();
        size.src = image;
        size.onload = function() {
          if (size.width != 999 || size.height != 999) {
           view.style.width = '90%';
           view.style.height = '90%';
           view.src = 'assets/RobocubsLogo.png';
          }
          else{
            view.src = image;
          }
        };
    })
    .catch(error => {
      document.getElementById('thumbnail').style.width = '90%';
      document.getElementById('thumbnail').style.height = '90%';
      document.getElementById('thumbnail').src = 'assets/RobocubsLogo.png';
    });
}

let redirect = (fileName) => {
  let currentUrl = window.location.href;
  let baseUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);
  let newUrl = baseUrl + fileName+ '.html';
  window.location.href = newUrl;
}

let checkLength = (title) => {
  document.getElementById('jobTitle').style.display = 'none';
  document.getElementById('scrollTitle').style.display = 'none';
  document.getElementById('jobTitle1').style.animation = 'none';
  document.getElementById('jobTitle2').style.animation = 'none';
  // Check if the text width exceeds the max number of characters in the smaller bounding box
  if (title.length > 28) {
    document.getElementById('jobTitle1').textContent = title;
    document.getElementById('jobTitle2').textContent = title;
    document.getElementById('scrollTitle').style.display = '';
    document.getElementById('jobTitle1').style.animation = '';
    document.getElementById('jobTitle2').style.animation = '';
  } else {
    document.getElementById('jobTitle').textContent = title;
    document.getElementById('jobTitle').style.display = '';
  }
}

let calcTime = (time) => {
  let minutes = false;
  let hours = false;
  let days = false;
  let daysUnit = ' days';
  let hoursUnit = ' hrs';
  let minutesUnit = ' mins';  

  if (time.includes('s')){
    time = time.replace('s', ' seconds');
    return time;
  }
  else {
    if (time.includes('m')){
      minutes = true;
    }
    if (time.includes('h')){
      hours = true;
    }
    if (time.includes('d')){
      days = true;
    }
    time = time.replace('m', '_');
    time = time.replace('h', '_');
    time = time.replace('d', '_');
    time = time.split('_');
  }
  if (days == true && hours == true && minutes == true){
    if (time[0] == 1){
      daysUnit = ' day';
    }
    if (time[1] == 1){
      hoursUnit = ' hr';
    }
    if (time[2] == 1){
      minutesUnit = ' min';
    }
    return time[0] + daysUnit + '<br>' + time[1] + hoursUnit + '<br>' + time[2] + minutesUnit;
  }
  else if (days == true && hours == true){
    if (time[0] == 1){
      daysUnit = ' day';
    }
    if (time[1] == 1){
      hoursUnit = ' hr';
    }
    return time[0] + daysUnit + '<br>' + time[1] + hoursUnit;
  }
  else if (days == true && minutes == true){
    if (time[0] == 1){
      daysUnit = ' day';
    }
    if (time[1] == 1){
      minutesUnit = ' min';
    }
    return time[0] + daysUnit + '<br>' + time[1] + minutesUnit;
  }
  else if (hours == true && minutes == true){
    if (time[0] == 1){
      hoursUnit = ' hr';
    }
    if (time[1] == 1){
      minutesUnit = ' min';
    }
    return time[0] + hoursUnit + '<br>' + time[1] + minutesUnit;
  }
  else if (days == true){
    if (time[0] == 1){
      daysUnit = ' day';
    }
    return time[0] + daysUnit;
  }
  else if (hours == true){
    if (time[0] == 1){
      hoursUnit = ' hr';
    }
    return time[0] + hoursUnit;
  }
  else if (minutes == true){
    if (time[0] == 1){
      minutesUnit = ' min';
    }
    return time[0] + minutesUnit;
  }
}

let checkIS = (title) => {
  if (title[4] == 'MK4IS') {
    document.getElementById('ISLabel').textContent = 'On';
  }
  else {
    document.getElementById('ISLabel').textContent = 'Off';
  }
  return title;
}

let updateProgressBar = (progress) => {
  if (progress == null) {
    progress = 0;
  }
  if (progress >= 3){
    var progressBarFill = document.querySelector('.progress-bar-fill');
    progressBarFill.style.width = progress + '%';
  }
}

let timeString = (time) => {
  let days = Math.floor(time / 86400);
  time = time - (days * 86400);
  let hours = Math.floor(time / 3600);
  time = time - (hours * 3600);
  let minutes = Math.floor(time / 60);
  time = time - (minutes * 60)
  if (days != 0) {
    if (days == 1){
      days = days + ' day';
    }
    else{
      days = days + ' days';
    }
  }
  else {
    days = '';
  }
  if (hours != 0) {
    if (hours == 1){
      hours = hours + ' hr';
    }
    else {
      hours = hours + ' hrs';
    }
  }
  else {
    hours = '';
  }
  if (minutes != 0) {
    if (minutes == 1){
      minutes = minutes + ' min';
    }
    else {
      minutes = minutes + ' mins';
    }
  }
  else {
    minutes = '';
  }
  if (days != '' && hours != '' && minutes != ''){
    return days + ', ' + hours + ', and ' + minutes;
  }
  else if (hours != '' && minutes != ''){
    return hours + ' and ' + minutes;
  }
  else if (days != '' && minutes != ''){
    return days + ' and ' + minutes;
  }
  else if (days != '' && hours != ''){
    return days + ' and ' + hours;
  }
  else if (days != ''){
    return days;
  }
  else if (hours != ''){
    return hours;
  }
  else if (minutes != ''){
    return minutes;
  }
  else {
    return time + ' seconds';
  }
}

let updateProgressNotices = (data) => {
  document.getElementById('progressNotices').style.animation = '';
  document.getElementById('percent').textContent = Math.ceil(data.progress) + '% complete';
  document.getElementById('progressNotices').style.animation = '';
  document.getElementById('timeRemaining').textContent = timeString(data.time_remaining) + ' remaining';
  document.getElementById('timeElapsed').textContent = timeString(data.time_printing) + ' elapsed';
  document.getElementById('percent1').textContent = Math.ceil(data.progress) + '% complete';
}

let shrinkText = (id) => {
  var element = document.getElementById(id);
  var parent = element.parentElement;
  var fontSize = window.getComputedStyle(element, null).getPropertyValue('font-size');
  fontSize = parseFloat(fontSize);

  while (element.scrollWidth > parent.offsetWidth) {
    fontSize--;
    element.style.fontSize = fontSize + "px";
  }
}

let updateDate = () => {
  let currentDateTime = new Date();
  let hours = currentDateTime.getHours();
  let minutes = currentDateTime.getMinutes();
  let day = currentDateTime.getDate();
  let month = currentDateTime.getMonth();
  let year = currentDateTime.getFullYear();
  let dow = currentDateTime.getDay();
  let dateFont = 40;
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let dayText = ['75', '75', '70', '50', '65', '75', '70']

  let ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12;

  if (minutes < 10){
    minutes = '0' + minutes;
  }

  document.getElementById('currentTime').textContent = hours + ':' + minutes + ' ' + ampm;
  document.getElementById('dow').style.fontSize = dayText[dow] + 'px';
  document.getElementById('dow').textContent = days[dow];
  if (month == 2){
    document.getElementById('date').style.fontSize = '35px';
    dateFont = 35;
  }
  if (month == 3){
    document.getElementById('date').style.transform = 'translateY(8px)';
    document.getElementById('year').style.transform = 'translateY(-10px)';
  }
  if (month == 4){
    document.getElementById('date').style.transform = 'translateY(13px)';
    document.getElementById('year').style.transform = 'translateY(-13px)';
  }
  if (month == 4){
    document.getElementById('date').style.fontSize = '31px';
    dateFont = 31;
  }
  if (month == 7){
    document.getElementById('date').style.fontSize = '35px';
    dateFont = 35;
  }
  if (month == 8){
    document.getElementById('date').style.fontSize = '35px';
    dateFont = 35;
  }
  if (month == 10){
    document.getElementById('date').style.fontSize = '37px';
    dateFont = 37;
  }
  if (day == 2){
    document.getElementById('date').style.fontSize = '37px';
    dateFont = 37;
  }
  if (day > 9){
    if (month == 3){
      document.getElementById('date').style.fontSize = '31px';
    }
    else{
      document.getElementById('date').style.fontSize = (dateFont - 5) + 'px';
    }
  }
  document.getElementById('date').textContent = months[month] + ' ' + day;
  document.getElementById('year').textContent = year;
}

// let splitFirmware = (name) => {
//   let firmware_split = name.split('-');
//   return firmware_split;
// }

let updateBedGraph = (data) => {
  let firstVal = false;

  if (bedyValues.every(value => value === 0)) {
    firstVal = true;
  }
  
  if (firstVal == true) {
    bedyValues.length = 0;
    for (let i = 0; i < 20; i++) {
      bedyValues.push(data);
    }
  }
  else {
    bedyValues.shift();
    bedyValues.push(data);
  }

  if (data > maxBedValue) {
    maxBedValue = data;
    bedChart.options.scales.yAxes[0].ticks.max = maxBedValue + 5;
    darkBedChart.options.scales.yAxes[0].ticks.max = maxBedValue + 5;
  }

  if (!bedyValues.includes(maxBedValue)) {
    maxBedValue = Math.max(...bedyValues) + 5;
    bedChart.options.scales.yAxes[0].ticks.max = maxBedValue;
    darkBedChart.options.scales.yAxes[0].ticks.max = maxBedValue;
  }

  bedChart.update();
  darkBedChart.update();
}

let updateNozzleGraph = (data) => {
  let firstVal = false;

  if (nozzleyValues.every(value => value === 0)) {
    firstVal = true;
  }
  
  if (firstVal == true) {
    nozzleyValues.length = 0;
    for (let i = 0; i < 20; i++) {
      nozzleyValues.push(data);
    }
  }
  else {
    nozzleyValues.shift();
    nozzleyValues.push(data);
  }

  if (data > maxNozzleValue) {
    maxNozzleValue = data;
    nozzleChart.options.scales.yAxes[0].ticks.max = maxNozzleValue + 10;
    darkNozzleChart.options.scales.yAxes[0].ticks.max = maxNozzleValue + 10;
  }

  if (!nozzleyValues.includes(maxBedValue)) {
    maxNozzleValue = Math.max(...nozzleyValues) + 10;
    nozzleChart.options.scales.yAxes[0].ticks.max = maxNozzleValue;
    darkNozzleChart.options.scales.yAxes[0].ticks.max = maxNozzleValue;
  }

  nozzleChart.update();
  darkNozzleChart.update();
}

let checkNozzleHeating = (current, target) => {
  let heating = false;
  let nozzleHeating = document.getElementById('nozzleHeating');
  let nozzleStable = document.getElementById('nozzleStable');
  
  if (current < (target - 2)) {
    if (!heating) {
      nozzleStartHeatingAnimation();
      heating = true;
      nozzleHeating.style.opacity = 1;
      nozzleStable.style.opacity = 0;
    }
  }
  else {
    heating = false;
    nozzleHeating.style.opacity = 0;
    nozzleStable.style.opacity = 1;
    nozzleStopHeatingAnimation();
  }
}

let checkBedHeating = (current, target) => {
  let heating = false;
  let bedHeating = document.getElementById('bedHeating');
  let bedStable = document.getElementById('bedStable');
  
  if (current < (target - 1)) {
    if (!heating) {
      bedStartHeatingAnimation();
      heating = true;
      bedHeating.style.opacity = 1;
      bedStable.style.opacity = 0;
    }
  }
  else {
    heating = false;
    bedHeating.style.opacity = 0;
    bedStable.style.opacity = 1;
    bedStopHeatingAnimation();
  }
}

function bedStartHeatingAnimation() {
  bedAnimateGradient();
  bedIntervalId = setInterval(bedAnimateGradient, 2000);
}

function nozzleStartHeatingAnimation() {
  nozzleAnimateGradient();
  nozzleIntervalId = setInterval(nozzleAnimateGradient, 2000);
}

function bedStopHeatingAnimation() {
  clearInterval(bedIntervalId);
}

function nozzleStopHeatingAnimation() {
  clearInterval(nozzleIntervalId);
}

let bedAnimateGradient = () => {
  let randomTranslateX;
  let randomTranslateY;
  const VarianceY = 250;

  randomTranslateX = Math.floor(Math.random() * 300) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  bedHeating1.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  bedHeating2.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300);
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  bedHeating3.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300);
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  bedHeating4.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 600) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  bedHeating5.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;
}

let nozzleAnimateGradient = () => {
  let randomTranslateX;
  let randomTranslateY;
  const VarianceY = 250;

  randomTranslateX = Math.floor(Math.random() * 300) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  nozzleHeating1.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  nozzleHeating2.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300);
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  nozzleHeating3.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 300);
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  nozzleHeating4.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;

  randomTranslateX = Math.floor(Math.random() * 600) - 300;
  randomTranslateY = Math.floor(Math.random() * (VarianceY * 2)) - VarianceY;
  nozzleHeating5.style.transform = `translate(${randomTranslateX}px, ${randomTranslateY}px)`;
}

/// MAIN LOOP ///
getJobStatic();
getInfo();
getThumbnail();
updateDate();
getJobDynamic();
getStatus(state => {});
setInterval(() => {
  updateDate();
  getJobDynamic();
  getStatus((state) => {
    if (state == 'IDLE') {
      // redirect('sleep');
    }
  });
}, updateInterval);