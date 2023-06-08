'use client';

import {Fragment} from 'react';
import {Disclosure} from '@headlessui/react';
import {InformationCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';

export default function ProvenanceMoreInfo({
  event,
  moreInfoEventProps,
  moreInfoLabelMap,
}) {
  return (
    <Disclosure as={Fragment} key={event.id}>
      {({open}) => (
        <>
          <Disclosure.Button className="justify-self-end col-span-1">
            <span className="ml-6 flex h-7 items-center">
              {open ? (
                <XCircleIcon className="h-6 w-6" aria-hidden="true" />
              ) : (
                <InformationCircleIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </span>
          </Disclosure.Button>
          <Disclosure.Panel as="div" className="col-span-9">
            {moreInfoEventProps
              .filter(propName => !!event[propName])
              .map(propName => (
                <>
                  <div className="italic text-gray-800">
                    {moreInfoLabelMap[propName]}
                  </div>
                  <p>{event[propName]}</p>
                </>
              ))}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
