import {Link} from 'next-intl';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/objects';
import Image from 'next/image';
import {ObjectIcon} from '@/components/icons';
import {H3} from '@/components/titles';

interface Props {
  heritageObject: HeritageObject;
}

export default function HeritageObjectCard({heritageObject}: Props) {
  const t = useTranslations('HeritageObjectCard');

  const unknownClassName = 'text-gray-500 text-xs py-1';

  return (
    <div
      className="group relative grid grid-rows-5 grid-cols-4 gap-0.5 overflow-hidden drop-shadow-md hover:drop-shadow-lg hover:-translate-y-0.5 transition ease-in-out duration-300 bg-sand-50"
      key={heritageObject.id}
      aria-label={t('heritageObject')}
    >
      <h2 className="row-span-2 col-span-3 font-semibold text-gray-900 p-3 mt-0 bg-white">
        <Link
          href={`/object/${encodeURIComponent(heritageObject.id)}`}
          data-testid="object-card-name"
          className="text-gray-900 inline-flex items-center"
        >
          <span aria-hidden="true" className="absolute inset-0 z-20" />
          <ObjectIcon className="w-6 h-6 mr-2" />
          {heritageObject.name}
        </Link>
      </h2>
      <div className="row-span-5 bg-white">
        {heritageObject.images && heritageObject.images.length > 0 ? (
          <div className="relative w-full h-full">
            <Image
              src={heritageObject.images[0].contentUrl}
              alt={heritageObject.name || ''}
              fill
              className="object-contain object-center"
            />
          </div>
        ) : (
          <div />
        )}
      </div>
      <div className="row-span-3 col-span-1 bg-white p-3">
        <H3>{t('date')}</H3>
        <p className={unknownClassName}>{t('dateUnknown')}</p>
      </div>
      <div className="row-span-3 col-span-2 bg-white p-3">
        <H3>{t('origin')}</H3>
        <p className={unknownClassName}>{t('originUnknown')}</p>
      </div>
    </div>
  );
}
