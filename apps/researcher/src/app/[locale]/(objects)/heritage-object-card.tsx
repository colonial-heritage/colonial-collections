import Link from 'next-intl/link';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/objects';
import Image from 'next/image';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import classNames from 'classnames';

interface Props {
  heritageObject: HeritageObject;
}

export default function HeritageObjectCard({heritageObject}: Props) {
  const t = useTranslations('HeritageObjectCard');
  const imageUrl =
    heritageObject.images && heritageObject.images.length > 0
      ? heritageObject.images[0].contentUrl
      : null;

  return (
    <Link
      href={`/objects/${encodeRouteSegment(heritageObject.id)}`}
      data-testid="object-card"
      className="min-h-[200px] border border-blueGrey-200 text-blueGrey-800 bg-greenGrey-50 rounded-sm flex flex-col sm:flex-row gap-2 cursor-pointer hover:bg-white"
      aria-label={t('heritageObject')}
    >
      <div
        className={classNames(
          'w-full p-2 flex flex-col justify-between gap-2',
          {
            'sm:w-1/2': imageUrl,
          }
        )}
      >
        <div className="font-semibold mt-4" data-testid="object-card-name">
          {heritageObject.name}
        </div>
        <div className="text-sm opacity-70">{heritageObject.owner?.name}</div>
      </div>
      {imageUrl ? (
        <div className="w-full sm:w-1/2 flex justify-center items-center bg-neutral-200">
          <div className="h-full w-full flex justify-center items-center relative">
            <Image
              src={imageUrl}
              alt={heritageObject.name || ''}
              fill
              // The size varies between 200 and 330px depending on the page width.
              sizes="330px"
              quality={40}
              className="object-contain object-center"
            />
          </div>
        </div>
      ) : (
        <div className="bg-neutral-100 h-full sm:w-10 flex flex-col justify-center items-center">
          <div className="text-neutral-400 text-xs sm:rotate-90 py-2 sm:py-0 whitespace-nowrap">
            {t('noImage')}
          </div>
        </div>
      )}
    </Link>
  );
}
