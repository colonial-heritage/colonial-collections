import heritageObjects from '@/lib/heritage-objects-instance';
import {LocaleEnum} from '@/definitions';
import {getTranslations, getLocale} from 'next-intl/server';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const locale = (await getLocale()) as LocaleEnum;
  const object = await heritageObjects.getById({id: objectIri, locale});
  const t = await getTranslations('HeritageObjectCard');

  if (!object) {
    return null;
  }

  return (
    <div className="bg-neutral-100 p-2 text-xs">
      {object.name || (
        <span className="text-consortiumBlue-100">{t('noName')}</span>
      )}
    </div>
  );
}
