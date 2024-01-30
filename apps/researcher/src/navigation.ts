import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export enum LocaleEnum {
  En = 'en',
  Nl = 'nl',
}

export const locales = Object.values(LocaleEnum);

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales});
