import {ReactNode} from 'react';
import {Label as HeadlessLabel} from '@headlessui/react';

export function FormRow({children}: {children: ReactNode}) {
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
}

export function InputLabel({
  title,
  description,
  required = false,
}: InputLabelProps) {
  return (
    <HeadlessLabel className="flex flex-col gap-1 mb-1 mt-8 first:mt-0">
      <strong>
        {title}
        {required && <span className="font-normal text-neutral-600">*</span>}
      </strong>
      <div>{description}</div>
    </HeadlessLabel>
  );
}

export function ButtonGroup({children}: {children: ReactNode}) {
  return <div className="py-4 flex gap-3">{children}</div>;
}
