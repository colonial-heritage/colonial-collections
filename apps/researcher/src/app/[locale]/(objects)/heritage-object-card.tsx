import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/objects';

interface Props {
  heritageObject: HeritageObject;
}

export default function HeritageObjectCard({heritageObject}: Props) {
  const t = useTranslations('heritageObjectCard');

  return (
    <div
      key={heritageObject.id}
      className="group relative flex flex-col overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-white"
      aria-label={t('HeritageObject')}
    >
      <div className="flex flex-1 flex-col space-y-2 p-6">
        <h2 className="font-semibold text-gray-900 mt-0">
          <Link
            href={`/object/${encodeURIComponent(heritageObject.id)}`}
            data-testid="object-card-name"
            className="text-gray-900"
          >
            <span aria-hidden="true" className="absolute inset-0" />
            {heritageObject.name}
          </Link>
        </h2>
        <p className="text-base text-gray-900">{heritageObject.description}</p>
      </div>
    </div>
  );
}
