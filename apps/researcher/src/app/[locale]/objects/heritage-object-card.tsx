import {Link} from '@/navigation';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/api/objects';
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
      : undefined;

  return (
    <Link
      href={`/objects/${encodeRouteSegment(heritageObject.id)}`}
      data-testid="object-card"
      className="min-h-[200px] bg-neutral-100 border border-neutral-200 rounded-sm flex flex-col sm:flex-row gap-2 cursor-pointer hover:border-consortiumBlue-800 no-underline"
      aria-label={t('heritageObject')}
    >
      <div
        className={classNames('w-full flex flex-col justify-between gap-2', {
          '': imageUrl,
        })}
      >
        <div className="font-semibold p-2" data-testid="object-card-name">
          {heritageObject.name || (
            <span className="text-sm text-neutral-600">{t('noName')}</span>
          )}
        </div>
        <div className="text-sm text-neutral-600 p-2">
          {heritageObject.isPartOf?.publisher?.name}
        </div>
      </div>
      {imageUrl ? (
        <div className="flex justify-start items-start border-l border-neutral-200">
          <Image
            src={imageUrl}
            alt={heritageObject.name || ''}
            width="0"
            height="0"
            // The size varies between 200 and 330px depending on the page width.
            sizes="270px"
            quality={40}
            className="object-contain object-center w-full"
          />
        </div>
      ) : (
        <div className="text-neutral-600 h-full sm:w-10 flex flex-col justify-center items-center">
          <div className="text-xs sm:rotate-90 py-2 sm:py-0 whitespace-nowrap">
            {t('noImage')}
          </div>
        </div>
      )}
    </Link>
  );
}
