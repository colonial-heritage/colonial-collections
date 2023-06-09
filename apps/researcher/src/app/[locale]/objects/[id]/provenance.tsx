import {Fragment} from 'react';
import {H2} from '@/components/titles';
import {useTranslations} from 'next-intl';
import {PersonIcon} from '@/components/icons';
import ProvenanceMoreInfo from './provenance-more-info';

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
    <div className="bg-white w-full drop-shadow-sm rounded-md inline-flex font-bold">
      <PersonIcon className="my-4 ml-2 h-6 w-6" />
      <span className="grow my-4 mx-2">{person.name}</span>
    </div>
  );
}

const moreInfoEventProps: ReadonlyArray<string> = ['name', 'description'];

export default function Provenance() {
  const t = useTranslations('Provenance');

  const moreInfoLabelMap = Object.fromEntries(
    moreInfoEventProps.map(propName => [propName, t(propName)])
  );

  const events = [
    {
      id: '1',
      date: '1887',
      type: 'Acquisition',
      classification: 'Gift',
      transferredTo: 'Museum',
      transferredFrom: 'Museum',
      location: 'Delft',
    },
    {
      id: '2',
      date: '1887-06-05',
      type: 'Transfer',
      classification: 'Loan',
      transferredTo: 'Museum',
      transferredFrom: 'Museum',
      location: 'Batavia',
      description: 'This is a description',
    },
    {
      id: '3',
      type: 'Transfer',
      classification: 'Loan',
      transferredTo: 'Museum',
      transferredFrom: 'Museum',
      location: 'Batavia',
      name: 'This is a name',
      description: 'This is a description',
    },
  ];

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
          const hasMoreInfo = moreInfoEventProps.some(
            propName => !!event[propName]
          );
          return (
            <>
              {event.date ? (
                <div className="font-bold">{event.date}</div>
              ) : (
                <div className="italic text-gray-500">{t('dateUnknown')}</div>
              )}
              <div className="grid grid-cols-9 w-full items-center my-1 pl-4 pb-4 border-l-2 gap-6">
                <div className="col-span-2">
                  {event.type} ({event.classification})
                </div>
                <div className="col-span-2">{event.transferredFrom}</div>
                <div className="col-span-2">
                  <Person />
                </div>
                <div className="col-span-2">{event.location}</div>
                {hasMoreInfo && (
                  <ProvenanceMoreInfo
                    event={event}
                    moreInfoEventProps={moreInfoEventProps}
                    moreInfoLabelMap={moreInfoLabelMap}
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
