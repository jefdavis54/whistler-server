import nodemailer from "nodemailer";

// zJED TODO: Fix this
async function sendAdminEmail(name: string, email: string, messageBody: string) {
  let transporter = nodemailer.createTransport(
    {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      logger: false,
      debug: false, // include SMTP traffic in the logs
    },
    {
      from: "Admin <admin@whistlerauctions.com>",
    },
  );

  // Message object
  let message = {
    // Comma separated list of recipients
    to: `${name} <${email}>`,

    // Subject of the message
    subject: "Nodemailer is unicode friendly ✔",

    // plaintext body
    text: `Hello to myself!\n${messageBody}`,

    // HTML body
    html:
      '<p><b>Hello</b> to myself <img src="cid:note@example.com"/></p>' +
      '<p>Here\'s a nyan cat for you as an embedded attachment:<br/><img src="cid:nyan@example.com"/></p>',

    // An array of attachments
    attachments: [
      // String attachment
      {
        filename: "notes.txt",
        content: "Some notes about this e-mail",
        contentType: "text/plain", // optional, would be detected from the filename
      },

      // Binary Buffer attachment
      {
        filename: "image.png",
        content: Buffer.from(
          "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAABlBMVEUAAAD/" +
            "//+l2Z/dAAAAM0lEQVR4nGP4/5/h/1+G/58ZDrAz3D/McH8yw83NDDeNGe4U" +
            "g9C9zwz3gVLMDA/A6P9/AFGGFyjOXZtQAAAAAElFTkSuQmCC",
          "base64",
        ),

        cid: "note@example.com", // should be as unique as possible
      },

      // File Stream attachment
      {
        filename: "nyan cat ✔.gif",
        path: __dirname + "/assets/nyan.gif",
        cid: "nyan@example.com", // should be as unique as possible
      },
    ],
  };

  return transporter.sendMail(message);
}

export default sendAdminEmail;
