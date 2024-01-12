'use server';

import sgMail from '@sendgrid/mail';
import {env} from 'node:process';

if (!env.SENDGRID_API_KEY) {
  throw new Error('Missing SENDGRID_API_KEY environment variable');
}
sgMail.setApiKey(env.SENDGRID_API_KEY);

interface Props {
  emailAddress: string;
  subject: string;
  body: string;
}

export async function sendEmail({emailAddress, subject, body}: Props) {
  if (!env.FROM_EMAIL_ADDRESS || !env.TO_EMAIL_ADDRESS) {
    throw new Error(
      'Missing FROM_EMAIL_ADDRESS or TO_EMAIL_ADDRESS environment variables'
    );
  }

  const message = {
    to: env.TO_EMAIL_ADDRESS,
    from: env.FROM_EMAIL_ADDRESS,
    replyTo: emailAddress,
    subject: subject,
    text: body,
  };

  try {
    await sgMail.send(message);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
