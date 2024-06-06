import {Link} from '@/navigation';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@colonial-collections/api';
import {encodeRouteSegment} from '@/lib/clerk-route-segment-transformer';
import ImageWithFallback from '@/components/image-with-fallback';
import classNames from 'classnames';
import {ImageFetchMode} from '@colonial-collections/list-store';

interface Props {
  heritageObject: HeritageObject;
  imageFetchMode: ImageFetchMode;
}

export function HeritageObjectCard({heritageObject, imageFetchMode}: Props) {
  const t = useTranslations('HeritageObjectCard');
  const imageUrl =
    heritageObject.images && heritageObject.images.length > 0
      ? heritageObject.images[0].contentUrl
      : undefined;

  return (
    <Link
      href={`/objects/${encodeRouteSegment(heritageObject.id)}`}
      data-testid="object-card"
      className=" mb-6 flex flex-col gap-2 hover:bg-white min-h-48 no-underline group transition-all border-2 hover:border-consortium-blue-800 rounded-sm pt-6 bg-neutral-100 border-white"
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

      {imageUrl && imageFetchMode !== ImageFetchMode.None && (
        <div>
          <ImageWithFallback
            src={imageUrl}
            alt={heritageObject.name || ''}
            width="0"
            height="0"
            sizes={imageFetchMode === ImageFetchMode.Large ? '270px' : '90px'}
            quality={40}
            className={classNames('max-h-72 object-cover object-center', {
              'w-full max-h-72': imageFetchMode === ImageFetchMode.Large,
              'w-1/3': imageFetchMode === ImageFetchMode.Small,
            })}
          />
        </div>
      )}
    </Link>
  );
}

export function HeritageObjectListItem({
  heritageObject,
  imageFetchMode,
}: Props) {
  const t = useTranslations('HeritageObjectCard');
  const imageUrl =
    heritageObject.images && heritageObject.images.length > 0
      ? heritageObject.images[0].contentUrl
      : undefined;
  return (
    <Link
      href={`/objects/${encodeRouteSegment(heritageObject.id)}`}
      data-testid="object-card"
      className="flex flex-row justify-between items-center gap-4 border-t border-neutral-200 py-3 w-full no-underline"
      aria-label={t('heritageObject')}
    >
      <div className="w-30 bg-blue-200">
        {imageUrl && imageFetchMode !== ImageFetchMode.None && (
          <div>
            <ImageWithFallback
              src={imageUrl}
              alt={heritageObject.name || ''}
              width="0"
              height="0"
              sizes={imageFetchMode === ImageFetchMode.Large ? '270px' : '90px'}
              quality={40}
              className="w-20 -my-3"
            />
          </div>
        )}

        {!imageUrl && imageFetchMode !== ImageFetchMode.None && (
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
    </Link>
  );
}
