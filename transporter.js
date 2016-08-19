const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.TRANSPORT_USER,
        pass: process.env.TRANSPORT_PASS
    }
});
