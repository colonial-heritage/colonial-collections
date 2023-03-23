import {useLocale} from 'next-intl';

export default async function Faq() {
  const locale = useLocale();
  const FaqPage = (await import(`@/messages/${locale}/faq.mdx`)).default;

  return <FaqPage />;
}
