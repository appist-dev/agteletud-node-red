const http = require('http');
const mqtt = require('mqtt');

const hostname = '192.168.2.169';
const port = 3001;
var tempCounterDirection = "up";
var temp = 45;
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
    }

    if (tempCounterDirection === "up") temp++; else temp--;
}, 1000)

function generateTempAlarm(temp) {
    const millis = Date.now() - start;
    const alarm = {type: "AirTempAlarm", timestamp: Math.floor( millis/ 1000), tempReached: temp};
    generatedAlarms.push(alarm);
    mqttSendAlarm(alarm);
}

function mqttSendAlarm(alarm) {
    var message = "";
    if (alarm.type === "AirTempAlarm"){
            message += "\n"+alarm.timestamp + "," +alarm.type + "," +alarm.tempReached + ",NULL";
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