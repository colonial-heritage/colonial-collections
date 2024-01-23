import {LocalizedMarkdown, Notifications} from '@colonial-collections/ui';
import {ContactForm} from '@colonial-collections/email-sender';

export default function Contact() {
  return (
    <>
      <LocalizedMarkdown
        name="contact"
        contentPath="@colonial-collections/content"
      />
      <Notifications />
      <ContactForm />
    </>
  );
}
