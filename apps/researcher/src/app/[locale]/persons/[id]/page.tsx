import {DateTimeFormatOptions, useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {PageHeader, PageTitle} from '@colonial-collections/ui';
import personFetcher from '@/lib/person-fetcher-instance';
import {getFormatter} from 'next-intl/server';
import {PersonIcon} from '@/components/icons';
import {H2, H3} from '@/components/titles';
import ToFilteredListButton from '@/components/to-filtered-list-button';
import {decodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

// Revalidate the page
export const revalidate = 0;

function NotImplemented() {
  const t = useTranslations('PersonDetails');

  return <div>{t('notImplemented')}</div>;
}

function NoData() {
  const t = useTranslations('PersonDetails');

  return <div>{t('noData')}</div>;
}

interface InfoBlockProps {
  title: string;
  value?: string;
}

function InfoBlock({title, value}: InfoBlockProps) {
  return (
    <div>
      <H3>{title}</H3>
      {value ? <p>{value}</p> : <NoData />}
    </div>
  );
}

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeRouteSegment(params.id);
  const person = await personFetcher.getById({id});
  const t = await getTranslations('PersonDetails');

  if (!person) {
    return <div data-testid="no-entity">{t('noEntity')}</div>;
  }

  const formatter = await getFormatter();

  const columnClassName = 'px-10 first:pl-0 last:pr-0 space-y-6 flex-1';
  const dateFormat: DateTimeFormatOptions = {
    dateStyle: 'long',
  };

  return (
    <>
      <div className="bg-consortiumBlue-800 text-white flex flex-col gap-8 pt-9 pb-40">
        <div className="px-4 sm:px-10 max-w-[1800px] mx-auto w-full">
          <ToFilteredListButton baseUrl="/persons">
            {t('backButton')}
          </ToFilteredListButton>
          <div className="mt-10 mb-4">
            <PageHeader>
              <PageTitle id="about">
                <PersonIcon className="w-7 h-7 mr-2" />
                {person.name}
              </PageTitle>
            </PageHeader>
          </div>
          <div className="flex divide-x divide-consortiumBlue-400 w-full mb-20">
            <div className={columnClassName}>
              <InfoBlock
                title={t('birthDate')}
                value={
                  person.birthDate &&
                  formatter.dateTime(person.birthDate, dateFormat)
                }
              />
              <InfoBlock
                title={t('birthPlace')}
                value={person.birthPlace?.name}
              />
            </div>
            <div className={columnClassName}>
              <InfoBlock
                title={t('deathDate')}
                value={
                  person.deathDate &&
                  formatter.dateTime(person.deathDate, dateFormat)
                }
              />
              <InfoBlock
                title={t('deathPlace')}
                value={person.deathPlace?.name}
              />
            </div>
            <div className={columnClassName}>
              <InfoBlock title={t('dataset')} value={person.isPartOf.name} />
            </div>
          </div>

          <H2>{t('relatedObjects')}</H2>
          <NotImplemented />
        </div>
      </div>
    </>
  );
}
