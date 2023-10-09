import heritageObjects from '@/lib/heritage-objects-instance';

interface Props {
  objectIri: string;
}

export default async function ObjectCard({objectIri}: Props) {
  const object = await heritageObjects.getById(objectIri);

  if (!object) {
    return null;
  }

  return (
    <div className="border border-blueGrey-200 text-blueGrey-800 bg-greenGrey-50 rounded-sm p-2 text-xs">
      {object.name}
    </div>
  );
}
