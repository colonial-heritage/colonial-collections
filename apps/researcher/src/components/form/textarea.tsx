import {useFormContext} from 'react-hook-form';
import {Textarea as HeadlessTextarea} from '@headlessui/react';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function Textarea({name, cols = 30, rows = 3}: Props) {
  const {register} = useFormContext();

  return (
    <HeadlessTextarea
      {...register(name)}
      cols={cols}
      rows={rows}
      className="border border-neutral-400 rounded p-2 text-sm w-full whitespace-normal max-w-xl"
    />
  );
}
