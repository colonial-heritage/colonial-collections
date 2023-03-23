import {useLocale} from 'next-intl';

export default async function About() {
  const locale = useLocale();
  const AboutPage = (await import(`@/messages/${locale}/about.mdx`)).default;

  return <AboutPage />;
}
