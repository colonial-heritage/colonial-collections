import {ReactNode} from 'react';

export function FormWrapper({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl gap-6">{children}</div>
  );
}

export function FormColumn({children}: {children: ReactNode}) {
  return <div className="flex flex-col w-full">{children}</div>;
}

interface InputLabelProps {
  title: string | ReactNode;
  description: string | ReactNode;
  required?: boolean;
  id?: string;
}

export function InputLabel({
  title,
  description,
  id,
  required = false,
}: InputLabelProps) {
  return (
    <label className="flex flex-col gap-1 mb-1" htmlFor={id}>
      <strong>
        {title}
        {required && <span className="font-normal text-neutral-600">*</span>}
      </strong>
      <div>{description}</div>
    </label>
  );
}

export function ButtonGroup({children}: {children: ReactNode}) {
  return <div className="py-4 flex gap-3">{children}</div>;
}
