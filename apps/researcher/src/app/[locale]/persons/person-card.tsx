import {useFormatter, useTranslations} from 'next-intl';
import Link from 'next-intl/link';
import {Person} from '@/lib/persons';
import {PersonIcon} from '@/components/icons';

interface Props {
  person: Person;
}

export default function PersonCard({person}: Props) {
  const t = useTranslations('PersonCard');
  const format = useFormatter();

  const unknownClassName = 'text-gray-500 text-xs py-1';

  return (
    <div
      key={person.id}
      className="group relative flex flex-col overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-white"
      aria-label={t('person')}
    >
      <div className="grid grid-cols-7 bg-sand-50 gap-0.5">
        <div className="col-span-3 bg-white p-4 inline-flex items-center">
          <h2 className="font-semibold text-lg text-gray-900 mt-0 inline-flex items-center">
            <PersonIcon className="w-6 h-6 mr-2" />
            <Link
              href={`/persons/${encodeURIComponent(person.id)}`}
              data-testid="person-card-name"
              className="text-gray-900"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {person.name}
            </Link>
          </h2>
        </div>
        <div className="col-span-2 bg-white p-4">
          {person.birthDate ? (
            <p>{format.dateTime(person.birthDate, {year: 'numeric'})} </p>
          ) : (
            <p className={unknownClassName}>{t('birthYearUnknown')}</p>
          )}
          {person.birthPlace ? (
            <p>{person.birthPlace.name}</p>
          ) : (
            <p className={unknownClassName}>{t('birthPlaceUnknown')}</p>
          )}
        </div>
        <div className="col-span-2 bg-white p-4">
          {person.deathDate ? (
            <p>{format.dateTime(person.deathDate, {year: 'numeric'})} </p>
          ) : (
            <p className={unknownClassName}>{t('deathYearUnknown')}</p>
          )}
          {person.deathPlace ? (
            <p>{person.deathPlace.name}</p>
          ) : (
            <p className={unknownClassName}>{t('deathPlaceUnknown')}</p>
          )}
        </div>
        <div className="col-span-7 bg-white p-4">{t('relatedObjects')}</div>
      </div>
    </div>
  );
}
