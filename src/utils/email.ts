import nodemailer from "nodemailer";

type Name = "verify" | "forgotPassword";
type Payload = {
  to: string;
  subject: string;
  name: Name;
  templateArgs: Record<string, string>
}

const templateMap: Record<Name, (args: Record<string, string>) => string> = {
  verify: ({ link }) => `<a href="${link}">${link}</a>`,
  forgotPassword: ({ link }) => `<a href="${link}">${link}</a>`
}

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
