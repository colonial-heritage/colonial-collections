import Link from 'next-intl/link';
import {useTranslations} from 'next-intl';
import {HeritageObject} from '@/lib/objects';
import Image from 'next/image';

interface Props {
  heritageObject: HeritageObject;
}

export default function HeritageObjectCard({heritageObject}: Props) {
  const t = useTranslations('HeritageObjectCard');

  const unknownClassName = 'text-gray-500 text-xs py-1';

  return (
    <Link
      href={`/objects/${encodeURIComponent(heritageObject.id)}`}
      // Todo test data-testid
      data-testid="object-card-name"
      className="border border-blueGrey-200 text-blueGrey-800 bg-greenGrey-50 rounded-sm flex flex-col sm:flex-row gap-2 cursor-pointer hover:bg-white"
      aria-label={t('heritageObject')}
    >
      <div className="w-full sm:w-1/2 p-2 flex flex-col justify-between gap-2">
        <div className="font-semibold mt-4">{heritageObject.name}</div>
        <div className="text-sm opacity-70">{heritageObject.owner?.name}</div>
      </div>
      <div className="w-full sm:w-1/2 flex justify-center items-center bg-neutral-200">
        <div className="w-full min-h-[200px] flex justify-center items-center relative">
          {heritageObject.images && heritageObject.images.length > 0 ? (
            <Image
              src={heritageObject.images[0].contentUrl}
              alt={heritageObject.name || ''}
              fill
              // Todo: recalculate
              // For min-width 1280px:
              // The page container is max 1280px. So above 1280px the size is fixed to 200px
              // For width 768px - 1280px:
              // The list is 2/4 of the page. The image is 1/4 of the list.
              // For max-width: 768px:
              // The image is 1/4 of page.
              sizes="(min-width: 1280px) 200px, (min-width: 768px) 17vw, 25vw"
              quality={40}
              className="object-contain object-center"
            />
          ) : (
            <div />
          )}
        </div>
      </div>
    </Link>
  );
}
