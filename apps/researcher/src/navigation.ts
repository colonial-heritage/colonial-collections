import {createSharedPathnamesNavigation} from 'next-intl/navigation';
import {LocaleEnum} from '@/definitions';

export const locales = Object.values(LocaleEnum);

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales});
