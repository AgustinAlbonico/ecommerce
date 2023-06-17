const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_ID, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
});

const sendEmail = asyncHandler(async (data, req, res) => {
  // send mail with defined transport object
  await transporter.sendMail({
    from: data.from, // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });
});

module.exports = {
  sendEmail,
};
