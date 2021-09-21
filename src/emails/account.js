const sgMail = require('@sendgrid/mail')
const apiKey = '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'
sgMail.setApiKey(apiKey)


console.log("inside account.js")



// sgMail.send({
//   to: 'sanjunarayanan123@gmail.com',
//   from: 'sanju@hopescoding.com',
//   subject: 'This is my first creation!',
//   text: 'I hope this one actually get to you.'
// })


const msg = {
  to: 'sanjunarayanan123@gmail.com',
  from: 'sanju@hopescoding.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}


sgMail.send(msg).then(() => {
  console.log('Email sent')
})
.catch((error) => {
  console.error(error)
})