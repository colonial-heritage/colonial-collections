import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {useFormContext, get} from 'react-hook-form';

export function FieldValidationMessage({field}: {field: string}) {
  const {formState} = useFormContext();

  const message = get(formState.errors, field)?.message;

  if (!message) {
    return null;
  }

  return (
    <div className="w-full flex justify-center">
      <div className="bg-orange-200/50 w-full max-w-xl flex items-start justify-center gap-2 px-2 py-1 rounded text-sm">
        <div className="w-4 mt-1">
          <ExclamationTriangleIcon className="w-4 h-4 stroke-neutral-700" />
        </div>
        <div>{message.toString()}</div>
      </div>
    </div>
  );
}
