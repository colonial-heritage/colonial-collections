import heritageObjects from '@/lib/heritage-objects-instance';
import {LocaleEnum} from '@/definitions';
import {DeleteObjectButton} from './buttons';
import ImageWithFallback from '@/components/image-with-fallback';
import {getLocale, getTranslations} from 'next-intl/server';

interface Props {
  objectIri: string;
  id: number;
}

export default async function ManageObjectCard({objectIri, id}: Props) {
  const t = await getTranslations('HeritageObjectCard');
  const locale = (await getLocale()) as LocaleEnum;
  const object = await heritageObjects.getById({id: objectIri, locale});

  if (!object) {
    return null;
  }

  const imageUrl =
    object.images && object.images.length > 0
      ? object.images[0].contentUrl
      : undefined;

  return (
    <div className="flex flex-row justify-start items-center gap-4 border-t border-neutral-200 py-3">
      {imageUrl ? (
        <div className="w-30">
          <ImageWithFallback
            src={imageUrl}
            alt={object.name || ''}
            width="0"
            height="0"
            sizes="80px"
            quality={40}
            className="w-20 -my-3"
          />
        </div>
      ) : (
        <div className="w-20 flex flex-col justify-center items-center text-xs text-neutral-400">
          {t('noImage')}
        </div>
      )}
      <div className="flex flex-col items-baseline gap-1">
        <div>{object.name}</div>
        <div className="text-sm text-neutral-600">
          {object.isPartOf?.publisher?.name}
        </div>
      </div>
      <div className="md:py-2 grow flex justify-end">
        <DeleteObjectButton id={id} />
      </div>
    </div>
  );
}
