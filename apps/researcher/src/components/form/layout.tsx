import {ReactNode} from 'react';

export function FormRow({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-12">{children}</div>
  );
}

export function FormColumn({children}: {children: ReactNode}) {
  return <div className="flex flex-col w-full -mt-8">{children}</div>;
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
    <label className="flex flex-col gap-1 mb-1 mt-8" htmlFor={id}>
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
