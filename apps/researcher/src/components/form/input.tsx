import {useFormContext} from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function Input({name, ...inputProps}: Props) {
  const {register} = useFormContext();

  return (
    <input
      {...register(name)}
      {...inputProps}
      className="w-full border border-neutral-300 p-2 text-sm"
    />
  );
}
