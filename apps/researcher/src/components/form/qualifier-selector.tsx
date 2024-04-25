'use client';

import {useController, useFormContext} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {qualifierOptions} from '@/lib/provenance-options';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function QualifierSelector({name}: Props) {
  const {control} = useFormContext();

  const controller = useController({control, name});

  const t = useTranslations('QualifierSelector');

  return (
    <>
      {qualifierOptions.map(option => (
        <div key={option.id} className="flex gap-2">
          <input
            id={option.translationKey}
            type="checkbox"
            checked={controller.field.value.id === option.id}
            onChange={event =>
              event.target.checked
                ? controller.field.onChange(option)
                : controller.field.onChange({id: '', translationKey: ''})
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
