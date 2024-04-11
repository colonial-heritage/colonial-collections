import {ReactNode} from 'react';
import {useFormContext} from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
  labelText: string | ReactNode;
}

export function CheckboxWithLabel({name, labelText, ...inputProps}: Props) {
  const {register} = useFormContext();

  return (
    <div className="flex justify-start gap-2 items-center">
      <input {...register(name)} {...inputProps} type="checkbox" />
      <label className="flex flex-col gap-1 mb-1" htmlFor={name}>
        {labelText}
      </label>
    </div>
  );
}
