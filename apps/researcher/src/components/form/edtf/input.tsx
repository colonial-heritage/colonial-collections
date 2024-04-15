'use client';

import {useController, useFormContext} from 'react-hook-form';
import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {fromDateString, toDateString} from './converter';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function EdtfInput({name}: Props) {
  const {control} = useFormContext();

  const controller = useController({
    name,
    control,
  });

  const defaultValues: {
    yyyy: string;
    mm: string;
    dd: string;
  } = useMemo(() => {
    const date = controller.field.value || '';
    return fromDateString(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [yyyy, setYyyy] = useState(defaultValues.yyyy);
  const [mm, setMm] = useState(defaultValues.mm);
  const [dd, setDd] = useState(defaultValues.dd);

  const t = useTranslations('FormatDate');

  useEffect(() => {
    const dateString = toDateString(yyyy, mm, dd);
    controller.field.onChange(dateString);
  }, [yyyy, mm, dd, name, controller.field]);

  return (
    <div className="flex w-fit border border-neutral-300">
      <input
        placeholder={t('yearInputLabel')}
        type="number"
        className="w-20 border-none bg-transparent"
        value={yyyy}
        onChange={e => setYyyy(e.target.value)}
        onBlur={controller.field.onBlur}
      />
      <span className="py-2 text-gray-300"> / </span>
      <input
        placeholder={t('monthInputLabel')}
        type="number"
        className="w-20 border-none bg-transparent"
        value={mm}
        onChange={e => setMm(e.target.value)}
        min={1}
        max={12}
        onBlur={controller.field.onBlur}
      />
      <span className="py-2 text-gray-300"> / </span>
      <input
        placeholder={t('dayInputLabel')}
        type="number"
        className="w-20 border-none bg-transparent"
        value={dd}
        onChange={e => setDd(e.target.value)}
        min={1}
        max={31}
        onBlur={controller.field.onBlur}
      />
    </div>
  );
}
