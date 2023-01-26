import {useTranslations} from 'next-intl';
import LocaleSwitcher from '@/components/locale-switcher';

export default function Home() {
  const t = useTranslations('Home');

  return (
    <main className="grid h-screen place-items-center">
      <h1 className="text-6xl">{t('title')}</h1>
      <h2>{t('description')}</h2>
      <LocaleSwitcher />
    </main>
  );
}
