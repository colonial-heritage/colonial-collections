import heritageObjects from '@/lib/heritage-objects-instance';
import organizations from '@/lib/organizations-instance';

interface Props {
  objectId: string;
}

export default async function ObjectCard({objectId}: Props) {
  const object = await heritageObjects.getById(objectId);

  if (!object) {
    return null;
  }

  const organization =
    object.isPartOf?.publisher?.id &&
    (await organizations.getById(object.isPartOf.publisher.id));

  return (
    <div
      key={objectId}
      className="border border-blueGrey-200 text-blueGrey-800 bg-greenGrey-50 rounded-sm flex flex-col sm:flex-row justify-between gap-2 cursor-pointer hover:bg-white"
    >
      <div className="w-full p-2 flex flex-col justify-between gap-2 min-h-[200px] sm:w-3/4">
        <div className="font-semibold mt-4">
          {object.name}
          <div className="font-normal">
            {object.creators?.map(creator => creator.name).join(', ') ?? ''}
          </div>
        </div>
        {organization && (
          <div className="text-sm opacity-70">
            {object.isPartOf?.publisher?.name}
          </div>
        )}
      </div>

      <div className="bg-neutral-100 w-full sm:w-10 flex flex-col justify-center items-center">
        <div className="text-neutral-400 text-xs sm:rotate-90 py-2 sm:py-0">
          No&nbsp;image
        </div>
      </div>
    </div>
  );
}
