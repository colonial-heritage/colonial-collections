import {useLocale} from 'next-intl';

export default async function Faq() {
  const locale = useLocale();
  const ContactPage = (await import(`@/messages/${locale}/faq.mdx`)).default;

  return <ContactPage />;
}
