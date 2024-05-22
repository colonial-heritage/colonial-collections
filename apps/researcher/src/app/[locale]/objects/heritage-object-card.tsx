import {Link} from '@/navigation';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@colonial-collections/api';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import ImageWithFallback from '@/components/image-with-fallback';
import classNames from 'classnames';
import {ImageVisibility} from './definitions';

interface Props {
  heritageObject: HeritageObject;
  imageVisibility: string;
}

export function HeritageObjectCard({heritageObject, imageVisibility}: Props) {
  const t = useTranslations('HeritageObjectCard');
  const imageUrl =
    heritageObject.images && heritageObject.images.length > 0
      ? heritageObject.images[0].contentUrl
      : undefined;

  return (
    <Link
      href={`/objects/${encodeRouteSegment(heritageObject.id)}`}
      data-testid="object-card"
      className=" mb-6 flex flex-col gap-2 hover:bg-white min-h-48 no-underline group transition-all border-2 hover:border-consortiumBlue-800 rounded-sm pt-6 bg-neutral-100 border-white"
      aria-label={t('heritageObject')}
    >
      <div
        className="font-semibold leading-5 px-2 "
        data-testid="object-card-name"
      >
        {heritageObject.name || (
          <span className="text-sm text-neutral-600">{t('noName')}</span>
        )}
      </div>
      <div className="text-sm text-neutral-600 px-2 mb-4 grow">
        {heritageObject.isPartOf?.publisher?.name}
      </div>

      {imageUrl &&
        (imageVisibility === ImageVisibility.Large ||
          imageVisibility === ImageVisibility.Small) && (
          <div>
            <ImageWithFallback
              src={imageUrl}
              alt={heritageObject.name || ''}
              width="0"
              height="0"
              sizes={
                imageVisibility === ImageVisibility.Large ? '270px' : '90px'
              }
              quality={40}
              className={classNames('max-h-72 object-cover object-center', {
                'w-full max-h-72': imageVisibility === ImageVisibility.Large,
                'w-1/3': imageVisibility === ImageVisibility.Small,
              })}
            />
          </div>
        )}
    </Link>
  );
}

export function HeritageObjectListItem({
  heritageObject,
  imageVisibility,
}: Props) {
  const t = useTranslations('HeritageObjectCard');
  const imageUrl =
    heritageObject.images && heritageObject.images.length > 0
      ? heritageObject.images[0].contentUrl
      : undefined;
  return (
    <div className="flex flex-row justify-start items-center gap-4 border-t border-neutral-200 py-3 w-full">
      <div className="w-30">
        {imageUrl &&
          (imageVisibility === ImageVisibility.Large ||
            imageVisibility === ImageVisibility.Small) && (
            <div>
              <ImageWithFallback
                src={imageUrl}
                alt={heritageObject.name || ''}
                width="0"
                height="0"
                sizes={
                  imageVisibility === ImageVisibility.Large ? '270px' : '90px'
                }
                quality={40}
                className="w-20 -my-3"
              />
            </div>
          )}

        {imageVisibility !== 'hide' && !imageUrl && (
          <div className="w-20 flex flex-col justify-center items-center text-xs text-neutral-400">
            {t('noImage')}
          </div>
        )}
      </div>
      <div className="flex flex-col items-baseline gap-1">
        <div data-testid="object-card-name">
          {heritageObject.name || (
            <span className="text-sm text-neutral-600">{t('noName')}</span>
          )}
        </div>
        <div className="text-sm text-neutral-600">
          {heritageObject.isPartOf?.publisher?.name}
        </div>
      </div>
      <div className="md:py-2 grow flex justify-end"></div>
    </div>
  );
}
