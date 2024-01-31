import heritageObjects from '@/lib/heritage-objects-instance';
import HeritageObjectCard from '@/app/[locale]/objects/heritage-object-card';
import {useLocale} from 'next-intl';
import {LocaleEnum} from '@/definitions';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const locale = useLocale() as LocaleEnum;
  const object = await heritageObjects.getById({id: objectIri, locale});

  if (!object) {
    return null;
  }

  return <HeritageObjectCard heritageObject={object} />;
}
