import {useTranslations} from 'next-intl';
import {ReactNode} from 'react';
import {create} from 'zustand';
import useCurrentPublisher from './useCurrentPublisher';

const useMetadata = create(() => ({
  identifier: '',
}));

interface Props {
  identifier: string;
  children: ReactNode;
}

export function MetadataContainer({identifier, children}: Props) {
  useMetadata.setState({identifier});
  const t = useTranslations('ObjectDetails');

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col xl:flex-row gap-2 xl:gap-10">
        <div className="w-full xl:w-1/5 border-t pt-4">
          <div className="sticky top-0 bg-white py-1">
            <h3 className="text-lg w-full my-1 flex items-center">
              {t(identifier)}
            </h3>
            <div className="text-neutral-500 text-sm">
              {t(`${identifier}SubTitle`)}
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
  isCurrentPublisher: boolean;
}

export function MetadataEntry({
  children,
  isCurrentPublisher = false,
}: MetadataEntryProps) {
  const {identifier} = useMetadata.getState();
  const {organization} = useCurrentPublisher.getState();
  const t = useTranslations('ObjectDetails');

  if (!children) {
    return (
      <div className="text-neutral-600 italic w-full border-t py-6 text-sm">
        {t.rich('noData', {
          subject: () => <span className="lowercase">{t(identifier)}</span>,
        })}
      </div>
    );
  }

  return (
    <div className="border-neutral-200 text-neutral-900 rounded border-t flex flex-col lg:flex-row justify-between gap-2 lg:divide-x divide-sand-100">
      <div className="w-full lg:w-3/5  py-3">{children}</div>
      <div className="w-full lg:w-2/5 px-2 py-3 text-xs text-sand-700 mt-1 flex flex-row justify-between gap-2">
        <div className="flex flex-col gap-1">
              name: () => <strong>{organization.name}</strong>,
              location: () => (
                <em>
                  {organization.address?.addressLocality},{' '}
                  {organization.address?.addressCountry}
                </em>
              ),
            })}
            {/*
            TODO: Add a 'changed on' date
            on <em>12-12-2018</em>
            */}
            </div>
          )}
          {isCurrentPublisher && <div>{t('currentPublisher')}</div>}
        </div>
      </div>
    </div>
  );
}
