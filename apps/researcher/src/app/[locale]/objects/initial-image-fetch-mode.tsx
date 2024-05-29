'use client';

import {ImageFetchMode, useListStore} from '@colonial-collections/list-store';
import {Field, Label, Radio, RadioGroup} from '@headlessui/react';
import {useTranslations} from 'next-intl';

const options = [
  {translationKey: 'hideImages', value: ImageFetchMode.None},
  {translationKey: 'showSmallerImages', value: ImageFetchMode.Small},
  {translationKey: 'showLargerImages', value: ImageFetchMode.Large},
];

export function InitialImageFetchMode() {
  const imageFetchMode = useListStore(s => s.imageFetchMode);
  const imageFetchModeChange = useListStore(s => s.imageFetchModeChange);

  const t = useTranslations('Settings');

  return (
    <div className="flex flex-col gap-1 border rounded mt-6 p-6 max-w-3xl">
      <strong>{t('images')}</strong>
      <p>
        {t.rich('imagesDescription', {
          em: children => <em>{children}</em>,
        })}
      </p>

      <RadioGroup
        className="mt-2 flex gap-6"
        value={imageFetchMode}
        onChange={imageFetchModeChange}
        aria-label={t('images')}
      >
        {options.map(option => (
          <Field
            key={option.value}
            className="inline-flex items-center bg-neutral-100 rounded p-2 w-full md:w-1/3"
          >
            <Radio
              value={option.value}
              className="mr-2 group flex size-4 items-center justify-center rounded-full border bg-white data-[checked]:border-consortium-blue-400"
            >
              <span className="invisible size-2 rounded-full bg-consortium-blue-400 group-data-[checked]:visible" />
            </Radio>
            <Label>{t(option.translationKey)}</Label>
          </Field>
        ))}
      </RadioGroup>
    </div>
  );
}
