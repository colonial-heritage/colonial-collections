'use client';

import {useFormContext} from 'react-hook-form';
import {useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {fromDateString, toDateString} from './converter';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function EdtfInput({name}: Props) {
  const {setValue, watch} = useFormContext();

  const defaultValues = useMemo(() => {
    const date = watch(name);
    return fromDateString(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [yyyy, setYyyy] = useState(defaultValues.yyyy);
  const [mm, setMm] = useState(defaultValues.mm);
  const [dd, setDd] = useState(defaultValues.dd);

  const t = useTranslations('FormatDate');

  useEffect(() => {
    const dateString = toDateString(yyyy, mm, dd);
    setValue(name, dateString);
  }, [yyyy, mm, dd, name, setValue]);

  return (
    <div className="flex w-fit border border-neutral-300">
      <input
        placeholder={t('yearInputLabel')}
        type="number"
        className="w-20 border-none bg-transparent"
        value={yyyy}
        onChange={e => setYyyy(e.target.value)}
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
      />
    </div>
  );
}
