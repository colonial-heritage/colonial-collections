import {useFormContext} from 'react-hook-form';
import {Input as HeadlessInput} from '@headlessui/react';
import {useRef} from 'react';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function Input({name, ...inputProps}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {register} = useFormContext();

  return (
    <HeadlessInput
      {...register(name)}
      {...inputProps}
      as="input" // Provide the correct type for the 'as' prop
      className="w-full border border-neutral-300 p-2 text-sm"
      ref={inputRef}
    />
  );
}
