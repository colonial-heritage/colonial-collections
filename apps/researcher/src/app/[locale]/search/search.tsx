'use client';

import {MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import {Combobox} from '@headlessui/react';
import {useRef, useState} from 'react';
import {FaceFrownIcon, GlobeAmericasIcon} from '@heroicons/react/24/solid';
import {useDebounce} from 'use-debounce';
import {Thing} from '@colonial-collections/api';
import classNames from 'classnames';
import useSWR from 'swr';

async function fetcher([url, query]: [string, string]): Promise<Thing[]> {
  const data = await fetch(`${url}?query=${query}`);
  return data.json();
}

function ConstituentItems({
  query,
  url,
  name,
}: {
  name: string;
  url: string;
  query: string;
}) {
  const {
    data: constituentItems,
    error,
    isLoading,
  } = useSWR([url, query], fetcher);

  return (
    <li>
      <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">
        {name}
      </h2>
      {isLoading ? (
        <div className="flex px-4 py-2.5 text-xs font-semibold text-gray-900">
          <span>Loading...</span>
        </div>
      ) : !constituentItems || constituentItems.length === 0 ? (
        <div className="flex px-4 py-2.5 text-xs font-semibold text-gray-900">
          <FaceFrownIcon
            className="h-5 w-5 mr-2 text-gray-400"
            aria-hidden="true"
          />
          <span>No results found</span>
        </div>
      ) : (
        <ul className="mt-2 text-sm text-gray-800">
          {constituentItems!.map(constituent => (
            <Combobox.Option
              key={constituent.id}
              value={constituent}
              className={({active}) =>
                classNames(
                  'cursor-default select-none px-4 py-2',
                  active && 'bg-gray-200'
                )
              }
            >
              {({active}) => (
                <div>
                  <p
                    className={classNames(
                      'text-sm font-medium',
                      active ? 'text-gray-900' : 'text-gray-700'
                    )}
                  >
                    {constituent.name}
                  </p>
                  <p
                    className={classNames(
                      'text-sm',
                      active ? 'text-gray-700' : 'text-gray-500'
                    )}
                  >
                    {constituent.description}
                  </p>
                </div>
              )}
            </Combobox.Option>
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Search() {
  const [selectedPerson, setSelectedPerson] = useState<Thing | undefined>(
    undefined
  );
  const [query, setQuery] = useState('');
  const [debouncedValue] = useDebounce(query, 500);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <Combobox.Input
          value={query}
          onChange={e => {
            setQuery(e.target.value);
          }}
          displayValue={(constituent: Thing) => constituent?.name ?? ''}
          className="h-12 w-full border border-neutral-300 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          autoComplete={'off'}
          onFocus={() => {
            buttonRef.current?.click();
          }}
        />
        <Combobox.Button ref={buttonRef}></Combobox.Button>
      </div>

      <Combobox.Options className="scroll-pb-2 scroll-pt-11 space-y-2 overflow-y-auto pb-2 border border-neutral-300">
        {query === '' ? (
          <div className="border-t border-gray-100 px-6 py-14 text-center text-sm sm:px-14">
            <GlobeAmericasIcon
              className="mx-auto h-6 w-6 text-gray-400"
              aria-hidden="true"
            />
            <p className="mt-4 font-semibold text-gray-900">
              Search for persons and institutions
            </p>
            <p className="mt-2 text-gray-500">
              Start typing to find a person or institution.
            </p>
          </div>
        ) : (
          <>
            <ConstituentItems
              name="Wikidata Constituent"
              query={debouncedValue}
              url="/search/api/wikidata"
            />
            <ConstituentItems
              name="Datahub Constituent"
              query={debouncedValue}
              url="/search/api/datahub"
            />
          </>
        )}
      </Combobox.Options>
    </Combobox>
  );
}
