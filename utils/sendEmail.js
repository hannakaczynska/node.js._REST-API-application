const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (verificationLink) => {
  try {
    sgMail.send({
      to: "hannakacz13@gmail.com",
      from: "hannakacz13@gmail.com",
      subject: "Potwiedź swój email",
      html: `<p>Witaj,</p>
    <p>Aby zweryfikować swój adres e-mail, kliknij poniższy link:</p>
    <a href="${verificationLink}">Zweryfikuj swój adres e-mail</a>
    <p>Jeśli nie rejestrowałeś konta, zignoruj tę wiadomość.</p>`,
    });
    console.log("Email sent");
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendVerificationEmail;
