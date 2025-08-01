'use client';

import {Link, usePathname, locales} from '@/navigation';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {UserButton, SignInButton, SignedOut} from '@clerk/nextjs';
import SignedIn from '@/lib/community/signed-in';
import {ConsortiumLogo} from '@colonial-collections/ui/branding';
import {NavigationMenu} from '@colonial-collections/ui';
import logoImage from '@colonial-collections/ui/branding/logo-colonial-collections-datahub-beta.png';
import {useMemo} from 'react';
import ToFilteredListButton from './to-filtered-list-button';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

interface Props {
  datasetBrowserUrl: string;
}

export default function Navigation({datasetBrowserUrl}: Props) {
  const pathname = usePathname();
  const locale = useLocale();

  const tNavigation = useTranslations('Navigation');
  const tLanguageSelector = useTranslations('LanguageSelector');
  const subMenuItems = useMemo(
    () =>
      [
        {name: tNavigation('about'), href: '/about'},
        {name: tNavigation('faq'), href: '/faq'},
        {name: tNavigation('contact'), href: '/contact'},
        {
          name: tNavigation('consortium'),
          href: 'https://colonialcollections.nl/',
        },
        {
          name: tNavigation('datasetBrowser'),
          href: datasetBrowserUrl,
        },
      ].map(item => ({
        ...item,
        active: item.href === pathname,
      })),
    [datasetBrowserUrl, pathname, tNavigation]
  );

  const languageMenuItems = useMemo(
    () =>
      locales.map(localeItem => ({
        name: tLanguageSelector(localeItem),
        href: `/revalidate/?path=${encodeRouteSegment(
          `/[locale]${pathname}`
        )}&redirect=${encodeRouteSegment(`/${localeItem}${pathname}`)}`,
        active: localeItem === locale,
        ariaLabel: tLanguageSelector('accessibilityLanguageSelector', {
          language: tLanguageSelector(locale),
        }),
      })),
    [locale, pathname, tLanguageSelector]
  );

  return (
    <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto flex flex-row flex-wrap gap-2 md:gap-4">
      <div className='class="order-1 grow flex items-center'>
        <Link href="/">
          <div className="flex items-center gap-2">
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
          </div>
        </Link>
      </div>
      <nav className="order-5 lg:order-2  w-full lg:w-auto flex justify-end items-center gap-7 text-sm sm:text-base sm:font-semibold">
        <ToFilteredListButton baseUrl="/objects">
          {tNavigation('searchObjects')}
        </ToFilteredListButton>
        <ToFilteredListButton baseUrl="/communities">
          {tNavigation('communities')}
        </ToFilteredListButton>
        <Link href="/research-aids">{tNavigation('researchGuide')}</Link>
      </nav>
      <nav className="order-2 lg:order-3 text-sm  grow flex items-center justify-end gap-2">
        <Link href="/" className="flex items-center">
          {tNavigation('home')}
        </Link>
        <NavigationMenu
          buttonText={tNavigation('subMenuButton')}
          menuItems={subMenuItems}
          Link={Link}
        />
      </nav>
      <div className="order-4 lg:order-4 text-sm  flex items-center">
        <NavigationMenu
          buttonText={tLanguageSelector(locale)}
          menuItems={languageMenuItems}
          Link="a"
        />
      </div>
      <div className="order-3 lg:order-5 text-sm flex items-center">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          <span data-testid="signed-in" />
        </SignedIn>
        <SignedOut>
          <SignInButton>
            <button
              data-testid="sign-in-button"
              className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 transition flex items-center gap-1 text-consortium-blue-900 bg-white"
            >
              {tNavigation('signIn')}
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}
