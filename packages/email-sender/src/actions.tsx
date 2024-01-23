'use server';

import sgMail from '@sendgrid/mail';
import {env} from 'node:process';

if (!env.SENDGRID_API_KEY || !env.FROM_EMAIL_ADDRESS || !env.TO_EMAIL_ADDRESS) {
  throw new Error('Invalid SendGrid environment variables');
}
sgMail.setApiKey(env.SENDGRID_API_KEY);

interface Props {
  emailAddress: string;
  subject: string;
  body: string;
}

export async function sendEmail({emailAddress, subject, body}: Props) {
  const message = {
    to: env.TO_EMAIL_ADDRESS!,
    from: env.FROM_EMAIL_ADDRESS!,
    replyTo: emailAddress,
    subject: subject,
    text: body,
  };

  return sgMail.send(message);
}
