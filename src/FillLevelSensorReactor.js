//setup needed packages http and mqtt
const http = require('http');
const mqtt = require('mqtt');

//setup variables and ip-adress for client and host
const hostname = '192.168.2.169';
const port = 3031; //defined port for this web-service
let fillLevelCounterDirection = "up"; //direction in which simulation values will grow
let fillLevel = 20;
let generatedAlarms = []; //vector for the generated alarms in which simulation vlaues will grow
const start = Date.now();
let client = mqtt.connect('mqtt://192.168.2.199')

//configure a new server to act as http server to access raw simulation data
const server = http.createServer(function (req, res) {
    if (req.url === '/') {

        // setup http response header
        res.writeHead(200, {'Content-Type': 'text/html'});

        // setup http response content
        res.write(
            '<html>' +
            '<body>' +
            '<div>' +
            '<p id="fillLevel">' + fillLevel + '</p>' +
            '</div>' +
            '</body>' +
            '</html>');
        res.end();
    } else
        res.end('Invalid Request!');
});

//start the server and continue running on a defined port and hostname
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

//loop for generating simulation data and to check for any reached predefined limits for the alarms
setInterval(() => {
    if (fillLevelCounterDirection === "up") fillLevel++; else fillLevel--;
    switch (true) {
        case (fillLevel >= 90):
            generateFillLevelAlarm(fillLevel);
            fillLevelCounterDirection = "down";
            break;
        case (fillLevel <= 10):
            fillLevelCounterDirection = "up";
            generateFillLevelAlarm(fillLevel);
            break;
    }
    mqttSendData(fillLevel);
}, 1000)

/**
 * The generateFillLevelAlarm generates a new Alarm of Type "ReactorFillLevelAlarm". It takes the
 * amount of fillLevel as argument and generates a new alarm to be held inside the generated Alarms vector.
 */
function generateFillLevelAlarm(fillLevel) {
    const millis = Date.now() - start;
    const alarm = {type: "ReactorFillLevelAlarm", timestamp: Math.floor(millis / 1000), argument: fillLevel + " %"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);

}

/**
 * The mqttSendAlarm sends out an existing alarm. It takes an alarm
 * as argument, generates a comma seperated string and publishes it via mqtt to a topic which is
 * subscribed by Node-Red.
 */
function mqttSendAlarm(alarm) {
    let message = "";
    message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    console.log("new alarm: " + alarm)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('AlarmDomain', message)
}

/**
 * The mqttSendData sends out the current flow rate. It takes the
 * amount of flow as argument and publishes it via mqtt to a topic which is
 * subscribed by Node-Red.
 */
function mqttSendData(fillLevel) {
    let message = "" + fillLevel.toString();

    if (!client.connected) {
        client.reconnect();
    }
    client.publish('FillLevelSensorReactor', message)
}
