import heritageObjects from '@/lib/heritage-objects-instance';
import HeritageObjectCard from '@/app/[locale]/objects/heritage-object-card';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const object = await heritageObjects.getById({id: objectIri});

  if (!object) {
    return null;
  }

  return <HeritageObjectCard heritageObject={object} />;
}
