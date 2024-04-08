import {useFormContext} from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function Textarea({name, cols = 30, rows = 30}: Props) {
  const {register} = useFormContext();

  return (
    <textarea
      {...register(name)}
      cols={cols}
      rows={rows}
      className="border border-greenGrey-200 rounded p-2"
    />
  );
}
