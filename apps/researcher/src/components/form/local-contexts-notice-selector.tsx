'use client';

import {useController, useFormContext} from 'react-hook-form';
import {useTranslations} from 'next-intl';
import {
  LocalContextsNoticeEnrichmentType,
  localContextsNoticeEnrichmentTypeMapping,
} from '@/app/[locale]/objects/[id]/local-contexts-notices/mapping';
import Image from 'next/image';
import {Field, Label, Radio, RadioGroup} from '@headlessui/react';
import {Fragment, useCallback} from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function LocalContextsNoticeSelector({name}: Props) {
  const {control, setValue} = useFormContext();
  const controller = useController({control, name});

  const t = useTranslations('LocalContextsNotices');

  const onChange = useCallback(
    (value: LocalContextsNoticeEnrichmentType) => {
      setValue(
        'description',
        t(
          localContextsNoticeEnrichmentTypeMapping[value]
            .descriptionTranslationKey
        )
      );
      controller.field.onChange(value);
    },
    [controller.field, setValue, t]
  );

  return (
    <RadioGroup
      value={controller.field.value}
      onChange={onChange}
      name="localContextsNoticeEnrichmentType"
      className="w-full flex gap-2 overflow-x-scroll mt-4"
    >
      {Object.entries(localContextsNoticeEnrichmentTypeMapping).map(
        ([key, value]) => (
          <Field as={Fragment} key={key}>
            <Radio
              className="w-32 flex flex-col justify-between items-center mb-2 bg-neutral-50 border border-neutral-200 p-2 hover:bg-neutral-200 data-[checked]:border-consortium-blue-300 data-[checked]:bg-neutral-200 gap-1"
              value={key}
            >
              <Label className="w-32 text-sm text-center">
                {t(value.titleTranslationKey)}
              </Label>
              <Image
                src={value.imageSrc}
                className="w-10"
                width={40}
                height={40}
                alt={t(value.titleTranslationKey)}
                loading="lazy"
              />
            </Radio>
          </Field>
        )
      )}
    </RadioGroup>
  );
}
