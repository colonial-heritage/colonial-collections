import {useFormContext} from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
}

export function Input({name, ...rest}: Props) {
  const {register} = useFormContext();

  return <input {...register(name)} {...rest} />;
}
