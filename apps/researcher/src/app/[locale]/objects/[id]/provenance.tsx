import {Fragment} from 'react';
import {H2} from '@/components/titles';
import {Link, useFormatter, useTranslations} from 'next-intl';
import {PersonIcon} from '@/components/icons';
import ProvenanceMoreInfo from './provenance-more-info';
import {ProvenanceEvent} from '@/lib/objects';
import {MinusIcon} from '@heroicons/react/24/solid';

function Person() {
  const person = {
    id: 'https://colonialheritage.triply.cc/bronbeek/stamboeken/id/people/4d8829d2245e2f373ca4b00853939c59',
    name: 'Bart; Herbert Dikstal',
    birthPlace: {id: 'Bennebroek', name: 'Bennebroek'},
    birthDate: '1759',
    deathPlace: {id: 'Kaap de Goede Hoop', name: 'Kaap de Goede Hoop'},
    deathDate: '1823',
    isPartOf: {
      id: 'https://colonial-heritage.triply.cc/Bronbeek/Stamboeken',
      name: 'Stamboeken',
    },
  };
  return (
    <Link href={`/persons/${encodeURIComponent(person.id)}`}>
      <div className="bg-white w-full drop-shadow-sm rounded-md inline-flex font-bold">
        <PersonIcon className="my-4 ml-2 h-6 w-6" />
        <span className="grow my-4 mx-2">{person.name}</span>
      </div>
    </Link>
  );
}

interface Props {
  events: ProvenanceEvent[];
}

export default function Provenance({events}: Props) {
  const t = useTranslations('Provenance');
  const format = useFormatter();

  return (
    <>
      <H2>{t('title')}</H2>
      <div className="mt-10 divide-gray-900/10">
        <div className="pl-4 grid grid-cols-9 w-full italic text-gray-800 border-b pb-2 mb-4 gap-6">
          <div className="col-span-2">{t('type')}</div>
          <div className="col-span-2">{t('transferredFrom')}</div>
          <div className="col-span-2">{t('transferredTo')}</div>
          <div className="col-span-2">{t('location')}</div>
        </div>
        {events.map(event => {
          const startDateText = event.startDate
            ? format.dateTime(event.startDate)
            : null;

          //  Only show an end date if its a different date then the start date
          const endDateText =
            event.endDate && format.dateTime(event.endDate) !== startDateText
              ? format.dateTime(event.endDate)
              : null;

          return (
            <>
              {!startDateText && !endDateText ? (
                <div className="italic text-gray-500">{t('dateUnknown')}</div>
              ) : (
                <div className="inline-flex space-x-4 items-center">
                  {startDateText && (
                    <div className="font-bold">{startDateText}</div>
                  )}
                  {startDateText && endDateText && (
                    <MinusIcon className="w-5 h-5 text-gray-400" />
                  )}
                  {endDateText && (
                    <div className="font-bold">{endDateText}</div>
                  )}
                </div>
              )}
              <div className="grid grid-cols-9 w-full items-center my-1 pl-4 pb-4 border-l-2 gap-6">
                <div className="col-span-2">
                  {event.types.map(type => (
                    <div key={type.id}>{type.name}</div>
                  ))}
                </div>
                <div className="col-span-2">{event.transferredFrom?.name}</div>
                <div className="col-span-2">{event.transferredTo?.name}</div>
                <div className="col-span-2">{event.location?.name}</div>
                {event.description && (
                  <ProvenanceMoreInfo
                    descriptionLabel={t('description')}
                    description={event.description}
                  />
                )}
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}
