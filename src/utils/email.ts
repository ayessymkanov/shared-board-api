import nodemailer from "nodemailer";

type Name = "verify" | "forgotPassword" | "invite";
type Payload = {
  to: string;
  subject: string;
  name: Name;
  templateArgs: Record<string, string>
}

const templateMap: Record<Name, (args: Record<string, string>) => string> = {
  verify: ({ link }) => `
    <div style="display: flex; flex-direction: column; max-width: 640px; margin: 0 auto;">
      <h1>Please verify your email</h1>
      <p>Use this link <a href="${link}">${link}</a> to activate your account at SharedBoard</p>
      <p>See you there!</p>
    </div>
  `,
  forgotPassword: ({ link }) => `
    <div style="display: flex; flex-direction: column; max-width: 640px; margin: 0 auto;">
      <p>You requested to reset your password at SharedBoard</p>
      <p>Use this link <a href="${link}">${link}</a> to create a new password</p>
      <p>See you there!</p>
    </div>
  `,
  invite: ({ name, link }) => `
    <div style="display: flex; flex-direction: column; max-width: 640px; margin: 0 auto;">
      <h1>${name} has invited you to join their team at SharedBoard</h1>
      <p>Here's a link to join SharedBoard <a href="${link}">${link}</a></p>
      <p>See you there!</p>
    </div>
  `,
};

export const sendEmail = ({ to, subject, name, templateArgs }: Payload) => {
  const transport = nodemailer.createTransport({
    // @ts-ignore
    host: process.env.MAILGUN_SMTP_SERVER,
    port: process.env.MAILGUN_SMTP_PORT?.toString(),
    auth: {
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.MAILGUN_SMTP_LOGIN,
    to,
    subject,
    html: templateMap[name](templateArgs),
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}
