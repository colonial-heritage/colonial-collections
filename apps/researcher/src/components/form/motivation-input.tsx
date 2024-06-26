'use client';

import {
  Field,
  Label,
  Popover,
  PopoverButton,
  PopoverPanel,
  Textarea,
} from '@headlessui/react';
import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {useController, useFormContext} from 'react-hook-form';
interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function MotivationInput({name}: Props) {
  const {control} = useFormContext();
  const controller = useController({control, name});
  const [motivation, setMotivation] = useState(controller.field.value);

  const t = useTranslations('MotivationInput');

  function saveClick() {
    controller.field.onChange(motivation);
  }

  return (
    <Field as={Popover} className="w-full text-sm mt-2 relative">
      {controller.field.value ? (
        <div className="flex items-center justify-between gap-2">
          {controller.field.value}
          <PopoverButton className="italic text-xs text-neutral-600 shrink-0">
            {t('editButton')}
          </PopoverButton>
        </div>
      ) : (
        <div className="text-right">
          <PopoverButton className="italic text-xs text-neutral-600">
            {t('openButton')}
          </PopoverButton>
        </div>
      )}
      <PopoverPanel className="w-full bg-neutral-100 p-4 flex-col gap-2 absolute shadow-xl z-40 text-left border border-neutral-200">
        <Label className="text-sm text-neutral-600">{t('description')}</Label>
        <Textarea
          className="h-28 border border-neutral-400 rounded p-2 text-sm w-full"
          value={motivation}
          onChange={event => setMotivation(event.target.value)}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs
                        bg-consortium-green-300
                        text-consortium-blue-800
                        hover:bg-consortium-green-200
                        transition flex items-center gap-1 text-right"
            onClick={saveClick}
          >
            {t('saveButton')}
          </button>
          <PopoverButton
            className="p-1 sm:py-2 sm:px-3 rounded-full text-xs bg-none hover:bg-neutral-300
                        text-neutral-800 transition flex items-center gap-1
                        border border-neutral-300 text-right"
          >
            {t('cancelButton')}
          </PopoverButton>
        </div>
      </PopoverPanel>
    </Field>
  );
}
