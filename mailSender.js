const nodemailer = require('nodemailer');

class MailSender{

  // create reusable transporter object using the default SMTP transport
  getTransport(){
      return nodemailer.createTransport({
          host: 'smtp.gmail.com', // server para enviar mail desde gmail
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: process.env.GMAIL_ACCOUNT,
              pass: process.env.GMAIL_PASSWORD,
          },
      });
  }

  // setup email data with unicode symbols
  generateMail(artist,aSubject,aMessage,aFrom){
      return {
          from: aFrom, // sender address
          to: artist.emails.toString(), // list of receivers
          subject: aSubject, // Subject line
          text: aMessage, // plain text body
          html: `<b>${aMessage}</b>` // html body
      };
  }

  sendMail(artist,subject,message,from){
      const transporter = this.getTransport();
      const mailOptions = this.generateMail(artist,subject,message,from);


     return transporter.sendMail(mailOptions)
         .then(response =>{
           console.log(response.header.status(200));
         });
  }
}

module.exports = {
  MailSender
};