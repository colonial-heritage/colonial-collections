'use client';

import {useController, useFormContext} from 'react-hook-form';
import {useTranslations} from 'next-intl';

const options = [
  {translationKey: 'possibly', id: 'http://vocab.getty.edu/aat/300435722'},
  {translationKey: 'probably', id: 'http://vocab.getty.edu/aat/300435721'},
];

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function QualifierSelector({name}: Props) {
  const {control} = useFormContext();

  const controller = useController({control, name});

  const t = useTranslations('QualifierSelector');

  return (
    <>
      {options.map(option => (
        <div key={option.id} className="flex gap-2">
          <input
            type="checkbox"
            checked={controller.field.value.id === option.id}
            onChange={event =>
              event.target.checked
                ? controller.field.onChange(option)
                : controller.field.onChange({id: '', name: ''})
            }
            onBlur={controller.field.onBlur}
          />
          <label htmlFor={option.translationKey}>
            {t(option.translationKey)}
          </label>
        </div>
      ))}
    </>
  );
}
