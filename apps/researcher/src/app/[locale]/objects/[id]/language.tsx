import {LanguageIcon} from '@heroicons/react/24/outline';
import ISO6391, {LanguageCode} from 'iso-639-1';

interface Props {
  languageCode: string;
}

export default function Language({languageCode}: Props) {
  return (
    <span className="inline-flex items-end gap-1 text-xs italic text-neutral-600 mt-2">
      <LanguageIcon className="w-4 h-4 stroke-neutral-600 scale-90" />
      {ISO6391.getName(languageCode as LanguageCode)}
    </span>
  );
}
