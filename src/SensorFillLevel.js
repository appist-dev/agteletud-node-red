const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3031;
let fillLevelCounterDirection = "up";
let fillLevel = 20;
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
        case (fillLevel >= 90):
            generateFillLevelAlarm(fillLevel);
            fillLevelCounterDirection = "down";
            break;
        case (fillLevel <= 10):
            fillLevelCounterDirection = "up";
            generateFillLevelAlarm(fillLevel);
            break;
    }

    if (fillLevelCounterDirection === "up") fillLevel++; else fillLevel--;
}, 1000)

function generateFillLevelAlarm(fillLevel) {
    const millis = Date.now() - start;
    const alarm = {type: "ReactorFillLevelAlarm", timestamp: Math.floor(millis / 1000), argument: fillLevel + " %"};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);

}

function mqttSendAlarm(alarm) {
    let message = "";
    if (alarm.type === "ReactorFillLevelAlarm") {
        message += "\n" + alarm.timestamp + "," + alarm.type + "," + alarm.argument;
    }
    console.log("new alarm: " + message)
    if (!client.connected) {
        client.reconnect();
    }
    client.publish('reactorAlarm', message)


}

client.on('message', function (topic, message) {
    // message is Buffer
    console.log("got message: " + message.toString())
    client.end()
})
