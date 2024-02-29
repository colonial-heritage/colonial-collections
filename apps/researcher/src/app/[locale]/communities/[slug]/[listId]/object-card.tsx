import heritageObjects from '@/lib/heritage-objects-instance';
import HeritageObjectCard from '@/app/[locale]/objects/heritage-object-card';
import {LocaleEnum} from '@/definitions';
import {getLocale} from 'next-intl/server';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const locale = (await getLocale()) as LocaleEnum;
  const object = await heritageObjects.getById({id: objectIri, locale});

  if (!object) {
    return null;
  }

  return <HeritageObjectCard heritageObject={object} />;
}
