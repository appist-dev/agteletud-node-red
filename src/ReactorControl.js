const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3000;
var tempCounterDirection = "up";
var pressureCounterDirection = "up";
var temp = 55;
var pressure = 6;
var fillLevel = 20;
var generatedAlarms = [];
const start = Date.now();


var client  = mqtt.connect('mqtt://192.168.2.199')

const server = http.createServer(function (req, res) {   //create web server
    if (req.url === '/') { //check the URL of the current request

        // set response header
        res.writeHead(200, {'Content-Type': 'text/html'});

        // set response content
        res.write(
            '<html>' +
            '<body>' +
            '<div>' +
            '<p id="temp">' + temp + '</p>' +
            '<p id="pressure">' + pressure + '</p>' +
            '<p id="fillLevel">' + fillLevel + '</p>' +
            '</div>' +
            '</body>' +
            '</html>');
        res.end();
    } else
        res.end('Invalid Request!');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

setInterval(() => {
    switch (true) {
        case (temp >= 95):
            tempCounterDirection = "down";
            generateTempAlarm(temp);
            break;
        case (temp <= 5):
            tempCounterDirection = "up";
            generateTempAlarm(temp);
            break;
        case (pressure >= 25):
            generatePressureAlarm(pressure);
            pressureCounterDirection = "down";
            break;
        case (pressure <= 0):
            pressureCounterDirection = "up";
            generatePressureAlarm(pressure);
            break;
        case (fillLevel >= 90):
            generateFillLevelAlarm(fillLevel);
            fillLevelCounterDirection = "down";
            break;
        case (fillLevel <= 10):
            fillLevelCounterDirection = "up";
            generateFillLevelAlarm(fillLevel);
            break;
    }

    if (tempCounterDirection === "up") temp++; else temp--;
    if (pressureCounterDirection === "up") pressure++; else pressure--;
}, 1000)

function generateTempAlarm(temp) {
    const millis = Date.now() - start;
    const alarm = {type: "ReactorTempAlarm", timestamp: Math.floor( millis/ 1000), argument: temp + " °C"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);
}

function generatePressureAlarm(pressure) {
    const millis = Date.now() - start;
    const alarm = {type: "ReactorPressureAlarm", timestamp: Math.floor( millis/ 1000), argument: pressure + " kg/m³"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);

}

function generateFillLevelAlarm(fillLevel) {
    const millis = Date.now() - start;
    const alarm = {type: "ReactorFillLevelAlarm", timestamp: Math.floor( millis/ 1000), argument: fillLevel + " %"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);

}

function mqttSendAlarm(alarm) {
    var message = "";
    if (alarm.type === "ReactorTempAlarm"){
            message += "\n"+alarm.timestamp + "," +alarm.type + "," +alarm.tempReached + ",NULL";
        }
        if (alarm.type === "ReactorPressureAlarm"){
            message += "\n"+alarm.timestamp + "," +alarm.type + ",NULL,"+alarm.pressureReached;
        }
        console.log("new alarm: "+message)
        if (!client.connected) {
        client.reconnect();
        }
        client.publish('reactorAlarm', message)


}

client.on('message', function (topic, message) {
  // message is Buffer
  console.log("got message: "+message.toString())
  client.end()
})
