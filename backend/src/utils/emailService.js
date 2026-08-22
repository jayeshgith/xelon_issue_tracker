import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        }
      : undefined
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();
  const from = process.env.SMTP_FROM || 'Xelon Issue Tracker <no-reply@xelon.local>';

  if (!transporter) {
    console.info(`Password reset email skipped. Reset link for ${to}: ${resetUrl}`);
    return;
  }

  await transporter.sendMail({
    from,
    to,
    subject: 'Reset your Xelon Issue Tracker password',
    text: `Hello ${name},\n\nUse this link to reset your password:\n${resetUrl}\n\nThis link expires in 15 minutes.`,
    html: `
      <p>Hello ${name},</p>
      <p>Use the link below to reset your Xelon Issue Tracker password.</p>
      <p><a href="${resetUrl}">Reset password</a></p>
      <p>This link expires in 15 minutes.</p>
    `
  });
};
