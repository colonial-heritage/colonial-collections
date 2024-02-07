import {useFormatter, useTranslations} from 'next-intl';
import {Link} from '@/navigation';
import {Person} from '@/lib/api/persons';
import {PersonIcon} from '@/components/icons';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';

interface Props {
  person: Person;
}

export default function PersonCard({person}: Props) {
  const t = useTranslations('PersonCard');
  const formatter = useFormatter();

  const unknownClassName = 'text-consortiumBlue-100 text-xs py-1';

  return (
    <div
      key={person.id}
      className="border border-consortiumGreen-300 bg-consortiumBlue-800 hover:bg-consortiumBlue-900 text-white group relative flex flex-col overflow-hidden"
      aria-label={t('person')}
    >
      <div className="grid grid-cols-7 gap-0.5">
        <div className="col-span-3  p-4 inline-flex items-center">
          <h2 className="font-semibold text-lg text-consortiumGreen-300 mt-0 inline-flex items-center">
            <PersonIcon className="w-6 h-6 mr-2" />
            <Link
              href={`/persons/${encodeRouteSegment(person.id)}`}
              data-testid="person-card-name"
              className=""
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {person.name}
            </Link>
          </h2>
        </div>
        <div className="col-span-2 p-4">
          {person.birthDate ? (
            <p>{formatter.dateTime(person.birthDate, {year: 'numeric'})} </p>
          ) : (
            <p className={unknownClassName}>{t('birthYearUnknown')}</p>
          )}
          {person.birthPlace ? (
            <p>{person.birthPlace.name}</p>
          ) : (
            <p className={unknownClassName}>{t('birthPlaceUnknown')}</p>
          )}
        </div>
        <div className="col-span-2 p-4">
          {person.deathDate ? (
            <p>{formatter.dateTime(person.deathDate, {year: 'numeric'})} </p>
          ) : (
            <p className={unknownClassName}>{t('deathYearUnknown')}</p>
          )}
          {person.deathPlace ? (
            <p>{person.deathPlace.name}</p>
          ) : (
            <p className={unknownClassName}>{t('deathPlaceUnknown')}</p>
          )}
        </div>
        <div className="col-span-7 p-4">{t('relatedObjects')}</div>
      </div>
    </div>
  );
}
