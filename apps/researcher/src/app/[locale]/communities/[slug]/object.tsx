import heritageObjects from '@/lib/heritage-objects-instance';
import {LocaleEnum} from '@/navigation';
import {useLocale} from 'next-intl';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const locale = useLocale() as LocaleEnum;
  const object = await heritageObjects.getById({id: objectIri, locale});

  if (!object) {
    return null;
  }

  return (
    <div className="bg-consortiumBlue-800 text-consortiumGreen-400 rounded p-2 text-xs">
      {object.name}
    </div>
  );
}
