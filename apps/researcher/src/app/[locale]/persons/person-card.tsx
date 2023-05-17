import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {Person} from '@/lib/persons';

interface Props {
  person: Person;
}

export default function PersonCard({person}: Props) {
  const t = useTranslations('PersonCard');

  return (
    <div
      key={person.id}
      className="group relative flex flex-col overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-white"
      aria-label={t('person')}
    >
      <div className="flex flex-1 flex-col space-y-2 p-6">
        <h2 className="font-semibold text-gray-900 mt-0">
          <Link
            href={`/persons/${encodeURIComponent(person.id)}`}
            data-testid="person-card-name"
            className="text-gray-900"
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {person.name}
          </Link>
        </h2>
        <p className="text-base text-gray-900">{person.birthPlace?.name}</p>
      </div>
    </div>
  );
}
