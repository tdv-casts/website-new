// @flow

const nodemailer = require('nodemailer');

const sendNotificationEmail = (subject, text) => {
    const transporterOpts = {
        host: process.env.SUBMIT_EMAIL_HOST,
        port: process.env.SUBMIT_EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.SUBMIT_EMAIL_USER,
            pass: process.env.SUBMIT_EMAIL_PASSWORD,
        }
    };

    if (!transporterOpts.host || !transporterOpts.port || !transporterOpts.auth.user || !transporterOpts.auth.pass) {
        console.log('Cannot send email: ' + subject);
        return;
    }

    const options = {
        from: '"tanzdervampire.info" <tanzdervampire@airblader.de>',
        to: 'admin@airblader.de',
        subject: `[${process.env.SUBMIT_EMAIL_ENV}]${subject}`,
        text: text,
    };

    const transporter = nodemailer.createTransport(transporterOpts);
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};

module.exports = { sendNotificationEmail };