const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3041;
let rotationSpeedCounterDirection = "up";
let rotationSpeed = 20;
let generatedAlarms = [];
const start = Date.now();


let client = mqtt.connect('mqtt://192.168.2.199')

const server = http.createServer(function (req, res) {   //create web server
    if (req.url === '/') { //check the URL of the current request

        // set response header
        res.writeHead(200, {'Content-Type': 'text/html'});

        // set response content
        res.write(
            '<html>' +
            '<body>' +
            '<div>' +
            '<p id="rotationSpeed">' + rotationSpeed + '</p>' +
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
    if (rotationSpeedCounterDirection === "up") rotationSpeed+=Math.floor(Math.random() * 5) + 1; else rotationSpeed-=Math.floor(Math.random() * 5) + 1;
    switch (true) {
        case (rotationSpeed >= 240):
            rotationSpeedCounterDirection = "down";
            generateRotationSpeedAlarm(rotationSpeed);
            break;
        case (rotationSpeed <= 3):
            rotationSpeedCounterDirection = "up";
            generateRotationSpeedAlarm(rotationSpeed);
            break;
    }
    mqttSendData(rotationSpeed);
}, 1000)

function generateRotationSpeedAlarm(rotationSpeed) {
    const millis = Date.now() - start;
    const alarm = {type: "MotorRotationSpeedAlarm", timestamp: Math.floor(millis / 1000), argument: rotationSpeed + " u/m"};
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
    if (alarm.type === "MotorRotationSpeedAlarm") {
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    }
    console.log("new alarm: " + message)
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
function mqttSendData(rotationSpeed) {
    let message = "" + rotationSpeed.toString();

    if (!client.connected) {
        client.reconnect();
    }
    client.publish('RotationSensorMotor', message)
}
