import {ReactNode} from 'react';
import Navigation from './navigation';
import {getTranslations} from 'next-intl/server';
import {WipMessage} from '@colonial-collections/ui';
import {Link} from '@/navigation';
import {env} from 'node:process';
import AuthHealthCheck from '@/lib/auth-health-check';

interface Props {
  children: ReactNode;
  wrapperClassName?: string;
}

export default async function BaseLayout({children, wrapperClassName}: Props) {
  const t = await getTranslations('ScreenReaderMenu');

  return (
    <>
      <AuthHealthCheck />
      <WipMessage Link={Link} />

      <div className="sr-only">
        <ul>
          <li>
            <a href="#facets">{t('jumpFilters')}</a>
          </li>
          <li>
            <a href="#search-results">{t('jumpResults')}</a>
          </li>
          <li>
            <a href="#page-navigation">{t('jumpNavigation')}</a>
          </li>
        </ul>
      </div>
      <div className={wrapperClassName}>
        <header className="w-full bg-consortium-blue-900 text-white py-2">
          <Navigation datasetBrowserUrl={env['DATASET_BROWSER_URL']!} />
        </header>
        {children}
      </div>
    </>
  );
}
