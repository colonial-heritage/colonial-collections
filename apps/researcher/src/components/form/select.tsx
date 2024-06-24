import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/react';
import classNames from 'classnames';
import {Controller, useFormContext} from 'react-hook-form';

interface Props {
  name: string;
  options: {id: string; name: string; description?: string}[];
  placeholder?: string;
  disabled?: boolean;
  testId?: string;
}

export function Select({
  name,
  options,
  placeholder,
  testId,
  disabled = false,
}: Props) {
  const {control} = useFormContext();

  return (
    <Controller
      control={control}
      defaultValue={{id: '', name: ''}}
      name={name}
      rules={{required: true}}
      render={({field: {ref, ...inputProps}}) => (
        <Listbox as="div" disabled={disabled} {...inputProps}>
          {({value}) => (
            <div className="relative mt-2">
              <ListboxButton
                ref={ref}
                className="rounded border border-neutral-300 p-2 text-sm flex items-center justify-between w-full bg-white"
                data-testid={testId}
              >
                {value?.id ? (
                  <div>{value?.name}</div>
                ) : (
                  <div className="text-neutral-500">{placeholder}</div>
                )}
                <ChevronDownIcon className="w-4 h-4 stroke-neutral-900" />
              </ListboxButton>

              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map(option => (
                  <ListboxOption
                    key={option.id}
                    value={option}
                    className={({selected}) =>
                      classNames(
                        'flex flex-col border-b text-left hover:bg-neutral-100 transition py-2',
                        {
                          'bg-neutral-100': selected,
                        }
                      )
                    }
                  >
                    <>
                      <div className="font-semibold px-4 py-1">
                        {option.name}
                      </div>
                      {option.description && (
                        <div className="px-4 pb-4">{option.description}</div>
                      )}
                    </>
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          )}
        </Listbox>
      )}
    />
  );
}
