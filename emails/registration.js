const {EMAIL_FROM, BASE_URL} = require('./../config/config');

module.exports.regEmail = email => {
  return {
    to: email,
    from: EMAIL_FROM,
    subject: 'Profile was created successfully',
    html: `
      <h1>Welcome to our service!</h1>
      <p>Account was created suceessfuly with email - ${email} !</p>
      <hr/>
      <a href="${BASE_URL}">UBER service</a>
    `,
  };
};
