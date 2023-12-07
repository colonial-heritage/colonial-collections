'use client';

import {Link, usePathname, locales} from '@/navigation';
import Image from 'next/image';
import {useLocale, useTranslations} from 'next-intl';
import {UserButton, SignInButton, SignedIn, SignedOut} from '@clerk/nextjs';
import {ConsortiumLogo} from '@colonial-collections/ui/branding';
import {NavigationMenu} from '@colonial-collections/ui';
import logoImage from '@colonial-collections/ui/branding/colonial-collections-consortium.png';
import {useMemo} from 'react';

export default function Navigation() {
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
      ].map(item => ({
        ...item,
        active: item.href === pathname,
      })),
    [pathname, tNavigation]
  );

  const languageMenuItems = useMemo(
    () =>
      locales.map(localeItem => ({
        name: tLanguageSelector(localeItem),
        href: pathname ?? '/',
        locale: localeItem,
        active: localeItem === locale,
        ariaLabel: tLanguageSelector('accessibilityLanguageSelector', {
          language: tLanguageSelector(locale),
        }),
      })),
    [locale, pathname, tLanguageSelector]
  );

  return (
    <div className="w-full px-4 sm:px-10 max-w-[1800px] mx-auto flex flex-col xl:flex-row xl:gap-8 xl:justify-between">
      <div className="order-2 xl:order-1 w-full flex flex-col md:flex-row justify-between md:items-center">
        <div className="">
          <Link href="/">
            <div className="flex items-center gap-2">
              <div className="w-10">
                <ConsortiumLogo />
              </div>
              <div>
                <Image
                  height={20}
                  width={254}
                  src={logoImage}
                  className="h-4 lg:h-5"
                  alt="Colonial Collections Consortium"
                />
              </div>
            </div>
          </Link>
        </div>
        <nav className="flex items-center flex-wrap">
          <Link
            href="/"
            className="text-white font-semibold no-underline py-2 md:py-4 px-3 whitespace-nowrap"
          >
            {tNavigation('home')}
          </Link>
          <Link
            href="/communities"
            className="text-white font-semibold no-underline py-2 md:py-4 px-3 whitespace-nowrap"
          >
            {tNavigation('communities')}
          </Link>
          <NavigationMenu
            buttonText={tNavigation('subMenuButton')}
            menuItems={subMenuItems}
            className="font-semibold"
          />
        </nav>
      </div>
      <div className="order-1 xl:order-2 w-full flex justify-end items-center gap-4 text-sm xl:w-auto">
        <NavigationMenu
          buttonText={tLanguageSelector(locale)}
          menuItems={languageMenuItems}
        />
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="whitespace-nowrap p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-neutral-200/50 hover:bg-neutral-300/50 transition flex items-center gap-1 text-consortiumBlue-900 bg-white">
                {tNavigation('signIn')}
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
