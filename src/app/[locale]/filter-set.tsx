import {SearchResultFilter} from '@/lib/dataset-fetcher';
import {useCallback, Dispatch} from 'react';
import {useTranslations} from 'next-intl';

interface Props {
  title: string;
  searchResultFilters: SearchResultFilter[];
  selectedFilters: string[];
  setSelectedFilters: Dispatch<string[]>;
  testId?: string;
}

export default function FilterSet({
  title,
  searchResultFilters,
  selectedFilters,
  setSelectedFilters,
  testId,
}: Props) {
  const t = useTranslations('Home');
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        setSelectedFilters([...selectedFilters, e.target.value]);
      } else {
        setSelectedFilters(
          selectedFilters.filter(filterId => e.target.value !== filterId)
        );
      }
    },
    [selectedFilters, setSelectedFilters]
  );

  return (
    <div
      className="pt-6 pr-4 max-w-[350px]"
      data-testid={testId}
      aria-label={t('accessibilitySelectToFilter')}
    >
      <fieldset>
        <legend className="block font-bold text-gray-900">{title}</legend>
        <div className="space-y-3 pt-2">
          {searchResultFilters.map(option => (
            <div key={`${option.id}${option.name}`} className="flex ">
              <input
                value={option.id}
                id={`${title}-${option.id}`}
                name={option.id}
                checked={selectedFilters.some(
                  filterId => option.id === filterId
                )}
                onChange={handleChange}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              <label
                htmlFor={`${title}-${option.id}`}
                className="ml-3 text-sm text-gray-900"
              >
                {option.name}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
