import {Checkbox, Field, Label} from '@headlessui/react';
import {CheckIcon} from '@heroicons/react/16/solid';
import {ReactNode} from 'react';
import {useController, useFormContext} from 'react-hook-form';

interface Props extends React.HTMLProps<HTMLInputElement> {
  name: string;
  labelText: string | ReactNode;
}

export function CheckboxWithLabel({name, labelText, ...inputProps}: Props) {
  const {control} = useFormContext();
  const controller = useController({control, name});

  return (
    <Field className="flex justify-start gap-2 items-center mb-1">
      <Checkbox
        {...inputProps}
        {...controller.field}
        as="div"
        className="shrink-0 flex-wrap group size-6 bg-white rounded border border-neutral-300 p-1 ring-1 ring-white ring-inset"
      >
        <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
      </Checkbox>
      <Label>{labelText}</Label>
    </Field>
  );
}
