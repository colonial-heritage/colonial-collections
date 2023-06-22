'use client';

import {Fragment} from 'react';
import {Disclosure} from '@headlessui/react';
import {InformationCircleIcon, XCircleIcon} from '@heroicons/react/24/outline';

interface Props {
  descriptionLabel: string;
  description: string;
}

export default function ProvenanceMoreInfo({
  descriptionLabel,
  description,
}: Props) {
  return (
    <Disclosure as={Fragment}>
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
            <div className="italic text-gray-800">{descriptionLabel}</div>
            <p>{description}</p>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
