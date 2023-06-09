const express = require('express');
const cors = require('cors');
const config = require('./config.js');

const accountSid = config.whatsAppAccountSID;
const authToken = config.whatsAppAuthToken;
const client = require('twilio')(accountSid, authToken);

let templateMessage = 'Your appointment is coming up on July 21 at 3PM';

const app = express();
const port = 3009;

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

app.post('/notifyUser', (req, res) => {
    let requestData = '';

    req.on('data', (chunk) => {
        requestData += chunk;
    });

    req.on('end', () => {
        console.log('Received POST data:', requestData);
        sendWhatsAppMessage(requestData);
        res.status(200).send('Notification sent to user');
    });
});

app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    // Initiate WhatsApp conversation
    // sendWhatsAppMessage(templateMessage);
});


function sendWhatsAppMessage(message) {
    client.messages
        .create({
            body: message,
            from: config.whatsAppNumber,
            to: config.toNumber
        })
        .then(message => console.log(message.sid))
        .catch(err => console.log(err));
}