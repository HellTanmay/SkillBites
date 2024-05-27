import nodemailer from 'nodemailer'
import { config } from 'dotenv';  
config()
const sendEmail = async function (email, subject, message) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      
     service:'gmail',
     host:'smtp.gmail.com',
      auth: {
        user: process.env.GMAIL_USERNAME,
        pass:process.env.GMAIL_PASSWORD ,
      },
    });
  
    // send mail with defined transport object
    const mailOptions = {
        from: process.env.GMAIL_USERNAME,
        to: email,
        subject: subject,
        html:message,
      };
      
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
  };
export default sendEmail