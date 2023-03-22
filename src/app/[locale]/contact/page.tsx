import {useLocale} from 'next-intl';

export default async function Contact() {
  const locale = useLocale();
  const ContactPage = (await import(`@/messages/${locale}/contact.mdx`))
    .default;

  return <ContactPage />;
}
