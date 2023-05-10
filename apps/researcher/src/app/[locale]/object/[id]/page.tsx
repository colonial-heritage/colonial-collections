import {useTranslations} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {PageHeader, PageTitle} from 'ui';
import objectFetcher from '@/lib/heritage-object-fetcher-instance';
import {HeritageObject} from '@/lib/heritage-fetcher';
import {Link} from 'next-intl';
import Image from 'next/image';
import {ReactNode} from 'react';

// Revalidate the page
export const revalidate = 0;

export interface HeaderProps {
  children: ReactNode;
}

function H2({children}: HeaderProps) {
  return <h2 className="font-semibold uppercase text-lg">{children}</h2>;
}

function H3({children}: HeaderProps) {
  return <h3 className="font-semibold uppercase text-gray-800">{children}</h3>;
}

function NotImplemented() {
  const t = useTranslations('Details');

  return <div>{t('notImplemented')}</div>;
}

function NoData() {
  const t = useTranslations('Details');

  return <div>{t('noData')}</div>;
}

interface InfoBlockProps {
  object: HeritageObject;
  objectKey:
    | 'types'
    | 'subjects'
    | 'materials'
    | 'techniques'
    | 'creators'
    | 'inscriptions';
  singleLine: boolean;
}

function InfoBlock({object, objectKey, singleLine}: InfoBlockProps) {
  const t = useTranslations('Details');

  const items = object[objectKey];

  if (!items || !items.length) {
    return null;
  }

  const itemStrings = items.map(item =>
    typeof item === 'string' ? item : item.name
  );

  return (
    <div>
      <H3>{t(objectKey)}</H3>
      {singleLine ? (
        <>{itemStrings.join(', ')}</>
      ) : (
        <>
          {itemStrings.map(string => (
            <div key={string}>{string}</div>
          ))}
        </>
      )}
    </div>
  );
}

interface Props {
  params: {id: string};
}

export default async function Details({params}: Props) {
  const id = decodeURIComponent(params.id);
  const object = await objectFetcher.getById({id});
  const t = await getTranslations('Details');

  if (!object) {
    return <div data-testid="no-object">{t('noObject')}</div>;
  }

  return (
    <>
      <Link href="/">{t('backButton')}</Link>
      <div className="grid grid-cols-5 mt-5">
        <div className="col-span-3 flex flex-col space-y-4">
          <PageHeader>
            <PageTitle id="about">{object.name}</PageTitle>
          </PageHeader>
          <div>
            <H3>{t('description')}</H3>
            <div>{object.description}</div>
          </div>
          <div>
            <H3>{t('date')}</H3>
            <NotImplemented />
          </div>
          <div>
            <H3>{t('owner')}</H3>
            {object.owner ? (
              <a href={object.owner.id} target="_blank" rel="noreferrer">
                {object.owner.name}
              </a>
            ) : (
              <NoData />
            )}
          </div>
          <div>
            <H3>{t('handle')}</H3>
            <NotImplemented />
          </div>
          <div>
            <H3>{t('license')}</H3>
            <NotImplemented />
          </div>
          <div className="space-y-4">
            <H2>{t('moreInfo')}</H2>
            <InfoBlock singleLine objectKey="materials" object={object} />
            <InfoBlock singleLine objectKey="types" object={object} />
            <InfoBlock
              singleLine={false}
              objectKey="techniques"
              object={object}
            />
            <InfoBlock singleLine objectKey="creators" object={object} />
            <InfoBlock
              singleLine={false}
              objectKey="inscriptions"
              object={object}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col space-y-4">
          <div className="flex justify-end space-x-3">
            <button
              disabled
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {t('saveButton')}
            </button>
            <button
              disabled
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              {t('shareButton')}
            </button>
          </div>
          {object.images?.length && (
            <div className="relative col-span-2 h-[250px] w-full">
              <Image
                alt={object.name || object.id}
                src={object.images[0].contentUrl}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="bg-gray-200 rounded-md p-4">
            <H3>{t('relatedPersons')}</H3>
            <NotImplemented />
          </div>
          <div className="bg-gray-200 rounded-md p-4">
            <H3>{t('origin')}</H3>
            <NotImplemented />
          </div>
          <div className="bg-white rounded-md p-4">
            <H3>{t('discussion')}</H3>
            <NotImplemented />
          </div>
        </div>
      </div>
    </>
  );
}
