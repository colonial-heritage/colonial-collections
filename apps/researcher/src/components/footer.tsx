import {Link} from '@/navigation';
import Image from 'next/image';
import logoImage from '@colonial-collections/ui/branding/logo-colonial-collections-datahub-alpha.png';
import {
  ConsortiumLogo,
  FooterBackground,
} from '@colonial-collections/ui/branding';
import {getTranslations} from 'next-intl/server';
import {env} from 'node:process';
import ToFilteredListButton from './to-filtered-list-button';

export const secondaryNavigation = [
  {translationKey: 'about', href: '/about'},
  {translationKey: 'faq', href: '/faq'},
  {translationKey: 'contact', href: '/contact'},
  {
    translationKey: 'consortium',
    href: 'https://colonialcollections.nl/',
  },
  {
    translationKey: 'datasetBrowser',
    href: env['DATASET_BROWSER_URL']!,
  },
];

export default async function Footer() {
  const t = await getTranslations('Navigation');

  return (
    <footer className="w-full bg-consortium-blue-800 text-consortium-blue-50 pt-20 pb-52 px-4 sm:px-10 relative mt-20">
      <div className="max-w-7xl w-full flex flex-col gap-4 lg:gap-10 lg:flex-row mx-auto">
        <div className="flex justify-center w-full max-w-6xl absolute bottom-0 opacity-20 z-0">
          <FooterBackground />
        </div>
        <div className="w-full lg:w-1/3">
          <Link href="/" className="flex flex-row gap-2">
            <div className="w-5 sm:w-10">
              <ConsortiumLogo />
            </div>
            <div className="relative h-6 sm:h-9">
              <Image
                src={logoImage}
                alt="Colonial Collections Consortium"
                sizes="33vw"
                style={{
                  width: 'auto',
                  height: '100%',
                }}
              />
            </div>
          </Link>
        </div>
        <div className="w-full lg:w-1/3 border-consortium-blue-400 border-r">
          <div className="flex flex-col gap-2 text-sm max-w-80">
            <p className="whitespace-pre-wrap">{t('footerText')}</p>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex gap-10 border-consortium-blue-400 border-r">
          <nav className="flex flex-col gap-1 text-lg font-semibold">
            <ToFilteredListButton baseUrl="/objects">
              {t('searchObjects')}
            </ToFilteredListButton>
            <ToFilteredListButton baseUrl="/communities">
              {t('communities')}
            </ToFilteredListButton>
            <Link href="/research-guide">{t('researchGuide')}</Link>
          </nav>
          <nav className="flex flex-col gap-1 text-sm">
            {secondaryNavigation.map(item => (
              <Link key={item.href} href={item.href}>
                {t(item.translationKey)}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
