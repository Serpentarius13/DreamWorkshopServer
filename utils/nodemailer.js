const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "smtp.elasticemail.com",
  port: 2525,
  secure: false,
  auth: {
    user: process.env.NODEMAILER_USERNAME,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});
