'use client';

import {SlideOut, SlideOutButton} from '@colonial-collections/ui';
import classNames from 'classnames';
import {useTranslations} from 'next-intl';
import {useDateFormatter} from '@/lib/date-formatter/hooks';

interface ProvidedByProps {
  dateCreated?: Date;
  citation?: string;
  name?: string;
  communityName?: string;
  id: string;
  isCurrentPublisher: boolean;
}

export async function ProvidedBy({
  isCurrentPublisher,
  dateCreated,
  citation,
  name,
  communityName,
  id,
}: ProvidedByProps) {
  const t = useTranslations('ProvidedBy');
  const {formatDate} = useDateFormatter();

  return (
    <div
      className={classNames('px-2 py-3 text-xs my-1 self-start w-full', {
        'text-neutral-900 border-l': isCurrentPublisher,
        'bg-consortiumGreen-100 text-consortiumBlue-800 rounded':
          !isCurrentPublisher,
      })}
    >
      <div>
        <div>
          {t.rich('name', {
            name: () => <strong>{name}</strong>,
          })}
        </div>
        {communityName && (
          <div>
            {t.rich('community', {
              name: () => <strong>{communityName}</strong>,
            })}
          </div>
        )}
      </div>

      {(dateCreated || citation) && (
        <div className="flex flex-col justify-between">
          {dateCreated && (
            <div>
              {t.rich('date', {
                date: () => formatDate(dateCreated),
              })}
            </div>
          )}
          {citation && (
            <div>
              <SlideOutButton
                id={`${id}-${dateCreated}-citation`}
                className="p-1 rounded hover:bg-black/10 -ml-1 mt-1"
              >
                {t('showCitationButton')}
              </SlideOutButton>
            </div>
          )}
        </div>
      )}
      {citation && (
        <SlideOut id={`${id}-${dateCreated}-citation`}>
          <div className="flex-col w-full mt-1 flex">
            <em>{t('resourceTitle')}:</em>
            {citation}
          </div>
        </SlideOut>
      )}
    </div>
  );
}
