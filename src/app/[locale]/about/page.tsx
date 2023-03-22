import {useLocale} from 'next-intl';

export default async function About() {
  const locale = useLocale();
  const ContactPage = (await import(`@/messages/${locale}/about.mdx`)).default;

  return <ContactPage />;
}
