import {HandThumbUpIcon} from '@heroicons/react/24/outline';
import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import {create} from 'zustand';

export const useCurrentOwner = create(() => ({
  name: '',
  location: '',
  dataKey: '',
}));

interface Props {
  dataKey: string;
  children: ReactNode;
}

export function MetadataContainer({dataKey, children}: Props) {
  useCurrentOwner.setState({dataKey: dataKey});
  const t = useTranslations('ObjectDetails');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-10">
        <div className="w-full xl:w-1/5 border-t pt-4">
          <div className=" sticky top-0 bg-white py-1">
            <h3 className="text-lg w-full my-1 flex items-center">
              {t(dataKey)}
            </h3>
            <div className="text-neutral-500 text-sm">
              {t(`${dataKey}SubTitle`)}
            </div>
          </div>
        </div>
        <div className="w-full xl:w-4/5 flex flex-col gap-2">{children}</div>
      </div>
    </div>
  );
}

interface MetadataEntryProps {
  children: ReactNode;
  isOwner: boolean;
  isEmpty: boolean;
}

export function MetadataEntry({
  children,
  isEmpty,
  isOwner = false,
}: MetadataEntryProps) {
  const {name, dataKey} = useCurrentOwner.getState();
  const t = useTranslations('ObjectDetails');

  if (isEmpty) {
    return (
      <div className="w-full flex flex-col gap-2">
        <div className="text-neutral-600 italic w-full border-t p-6">
          No <span className="lowercase">{t(dataKey)}</span> available
        </div>
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 text-neutral-900 rounded flex flex-col lg:flex-row justify-between gap-2 lg:divide-x divide-sand-100">
      <div className="w-full lg:w-3/5 px-2 py-3 ">{children}</div>
      <div className="w-full lg:w-2/5 px-2 py-3 text-xs text-sand-700 mt-1 flex flex-row justify-between gap-2 ">
        <div className="flex flex-col gap-1">
          <div>
            Added by
            <strong className="ml-1">{name}</strong>
            {/* Form <em>Amsterdam, Netherlands</em>
            on <em>12-12-2018</em> */}
          </div>
          {isOwner && <div>Current owner</div>}
        </div>
        <div className="flex shrink">
          <div>
            <button className="flex items-center py-2 px-3 rounded-full bg-sand-100 text-sand-900 hover:bg-white transition text-xs">
              <HandThumbUpIcon className="w-4 h-4 stroke-sand-600" />
              &nbsp;(0)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
