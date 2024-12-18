"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper

let transporter;

async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  transporter = nodemailer.createTransport({
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '<>', // generated ethereal user
      pass: '<>', // generated ethereal password
    },
  });
}

main().catch(console.error);

async function sendNoReplyEmail(to, subject, html) {
    let info = await transporter.sendMail({
        from: '"St. Mina Clinic Don\'t Reply" <no-reply@stminaclinic.org>', // sender address
        to,
        subject,
        html,
        });
    if (info && info.messageId) {
        return {status: 'Email Sent'};
    }
}

exports.sendNoReplyEmail = sendNoReplyEmail;
