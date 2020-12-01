const {EMAIL_FROM, BASE_URL} = require('./../config/config');

module.exports.resetPassword = (email, token) => {
  return {
    to: email,
    from: EMAIL_FROM,
    subject: 'Reset password',
    html: `
      <h1>Have you forgotten password?</h1>
      <p>If no - ignore this letter.</p>
      <p>If yes - click on the link below:</p>
      <p><a href="${BASE_URL}/password/${token}">Resset password</a></p>
      <hr/>
      <a href="${BASE_URL}">UBER service</a>
    `,
  };
};
