import heritageObjects from '@/lib/heritage-objects-instance';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const object = await heritageObjects.getById({id: objectIri});

  if (!object) {
    return null;
  }

  return (
    <div className="bg-consortiumBlue-800 text-consortiumGreen-400 rounded p-2 text-xs">
      {object.name}
    </div>
  );
}
