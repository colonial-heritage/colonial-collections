'use client';

import {MagnifyingGlassIcon} from '@heroicons/react/20/solid';
import {Combobox} from '@headlessui/react';
import {useRef, useState} from 'react';
import {FaceFrownIcon} from '@heroicons/react/24/solid';
import {useDebounce} from 'use-debounce';
import classNames from 'classnames';
import useSWR from 'swr';
import {useFormContext} from 'react-hook-form';
import {Thing} from '@colonial-collections/api';
import {useTranslations} from 'next-intl';

async function fetcher([url, query]: [string, string]): Promise<Thing[]> {
  const data = await fetch(`${url}?query=${query}`);
  return data.json();
}

interface Props {
  name: string;
  searchers: {
    name: string;
    url: string;
  }[];
}

export function SearchSelector({name, searchers}: Props) {
  const [query, setQuery] = useState('');
  const [debouncedValue] = useDebounce(query, 500);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {setValue, watch} = useFormContext();
  const t = useTranslations('SearchSelector');

  return (
    <Combobox value={watch(name)} onChange={value => setValue(name, value)}>
      <div className="relative">
        <MagnifyingGlassIcon
          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        <Combobox.Input
          onChange={e => {
            setQuery(e.target.value);
          }}
          displayValue={(searchItem: Thing) => searchItem?.name ?? ''}
          className="h-12 w-full border border-neutral-300 bg-white pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
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
            <p className="mt-2 text-gray-500">{t('beforeTyping')}</p>
          </div>
        ) : (
          <>
            {searchers.map(searcher => (
              <SearcherItems
                key={searcher.url}
                name={searcher.name}
                query={debouncedValue}
                url={searcher.url}
              />
            ))}
          </>
        )}
      </Combobox.Options>
    </Combobox>
  );
}

function SearcherItems({
  query,
  url,
  name,
}: {
  name: string;
  url: string;
  query: string;
}) {
  const {data: searchResults, isLoading} = useSWR([url, query], fetcher);
  const t = useTranslations('SearchSelector');

  return (
    <li>
      <h2 className="bg-gray-100 px-4 py-2.5 text-xs font-semibold text-gray-900">
        {name}
      </h2>
      {isLoading ? (
        <div className="flex px-4 py-2.5 text-xs font-semibold text-gray-900">
          <span>{t('loading')}</span>
        </div>
      ) : !searchResults || searchResults.length === 0 ? (
        <div className="flex px-4 py-2.5 text-xs font-semibold text-gray-900">
          <FaceFrownIcon
            className="h-5 w-5 mr-2 text-gray-400"
            aria-hidden="true"
          />
          <span>{t('noResults')}</span>
        </div>
      ) : (
        <ul className="mt-2 text-sm text-gray-800">
          {searchResults!.map(searchItem => (
            <Combobox.Option
              key={searchItem.id}
              value={searchItem}
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
                    {searchItem.name}
                  </p>
                  <p
                    className={classNames(
                      'text-sm',
                      active ? 'text-gray-700' : 'text-gray-500'
                    )}
                  >
                    {searchItem.description}
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
