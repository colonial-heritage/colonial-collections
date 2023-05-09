import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/heritage-fetcher';
import Image from 'next/image';

interface Props {
  heritageObject: HeritageObject;
}

export default function HeritageObjectCard({heritageObject}: Props) {
  const t = useTranslations('HeritageObjectCard');

  return (
    <div
      key={heritageObject.id}
      className="group relative flex flex-col overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-white"
      aria-label={t('HeritageObject')}
    >
      <div className="grid grid-cols-5 space-y-2 p-6">
        <div className="col-span-3">
          <h2 className="font-semibold text-gray-900 mt-0">
            <Link
              href={`/heritageObject/${encodeURIComponent(heritageObject.id)}`}
              data-testid="heritageObject-card-name"
              className="text-gray-900"
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {heritageObject.name}
            </Link>
          </h2>
          <p className="text-base text-gray-900">
            {heritageObject.description}
          </p>
        </div>
        <div className="relative col-span-2">
          {heritageObject.images?.length && (
            <Image
              alt={heritageObject.name || heritageObject.id}
              src={heritageObject.images[0].contentUrl}
              fill={true}
            />
          )}
        </div>
      </div>
    </div>
  );
}
