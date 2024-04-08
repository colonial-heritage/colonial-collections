import {ReactNode} from 'react';

export function FormWrapper({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col lg:flex-row max-w-7xl gap-6">{children}</div>
  );
}

export function InputGroup({children}: {children: ReactNode}) {
  return <div className="flex flex-col w-full">{children}</div>;
}

export function InputLabel({
  title,
  description,
  id,
  required = false,
}: {
  title: string;
  description: string;
  required?: boolean;
  id?: string;
}) {
  return (
    <label className="flex flex-col gap-1 mb-1" htmlFor={id}>
      <strong>{title}</strong>
      {required && <span className="font-normal text-neutral-600">*</span>}
      <div>{description}</div>
    </label>
  );
}

export function ButtonGroup({children}: {children: ReactNode}) {
  return <div className="py-4 flex gap-3">{children}</div>;
}
