const config = require('./config.js');

const accountSid = config.whatsAppAccountSID;
const authToken = config.whatsAppAuthToken;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Your appointment is coming up on July 21 at 3PM',
        from: config.whatsAppNumber,
        to: config.toNumber
    })
    .then(message => console.log(message.sid))
    .catch(err => console.log(err));