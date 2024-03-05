import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';
import {Combobox} from '@headlessui/react';
import {useState} from 'react';
import classNames from 'classnames';
import ISO6391 from 'iso-639-1';

interface Props {
  value: string;
  setValue: (value: string) => void;
}

export default function LanguageSelector({value, setValue}: Props) {
  const [query, setQuery] = useState('');

  const filteredLanguageCodes = query
    ? ISO6391.getAllCodes().filter(code => {
        const englishName = ISO6391.getName(code);
        const localName = ISO6391.getNativeName(code);
        // Search in both the name and the native name
        return `${englishName.toLowerCase()} ${localName.toLowerCase()}`.includes(
          query.toLowerCase()
        );
      })
    : ISO6391.getAllCodes();

  return (
    <Combobox as="div" value={value} onChange={setValue}>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={event => setQuery(event.target.value)}
          displayValue={() =>
            ISO6391.validate(value)
              ? `${ISO6391.getName(value)} (${ISO6391.getNativeName(value)})`
              : value
          }
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredLanguageCodes.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredLanguageCodes.map(languageCode => (
              <Combobox.Option
                key={languageCode}
                value={languageCode}
                className={({active}) =>
                  classNames(
                    'relative cursor-default select-none py-2 pl-3 pr-9',
                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                  )
                }
              >
                {({active, selected}) => (
                  <>
                    <div className="flex">
                      <span
                        className={classNames(
                          'truncate',
                          selected && 'font-semibold'
                        )}
                      >
                        {ISO6391.getName(languageCode)}
                      </span>
                      <span
                        className={classNames(
                          'ml-2 truncate text-gray-500',
                          active ? 'text-indigo-200' : 'text-gray-500'
                        )}
                      >
                        {ISO6391.getNativeName(languageCode)}
                      </span>
                    </div>

                    {selected && (
                      <span
                        className={classNames(
                          'absolute inset-y-0 right-0 flex items-center pr-4',
                          active ? 'text-white' : 'text-indigo-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
