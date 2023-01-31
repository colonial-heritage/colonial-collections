import {useCallback, Dispatch} from 'react';

interface Props {
  title: string;
  options: {
    value: string;
    label: string;
  }[];
  selectedFilters: string[];
  setSelectedFilters: Dispatch<string[]>;
}

export default function FilterSet({
  title,
  options,
  selectedFilters,
  setSelectedFilters,
}: Props) {
  const handleChange = useCallback(
    (e: {target: {value: string; checked: boolean}}) => {
      if (e.target.checked) {
        setSelectedFilters([...selectedFilters, e.target.value]);
      } else {
        setSelectedFilters(selectedFilters.filter(i => e.target.value !== i));
      }
    },
    [selectedFilters, setSelectedFilters]
  );

  return (
    <div key={title} className="pb-10">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-900">
          {title}
        </legend>
        <div className="space-y-3 pt-6">
          {options.map((option, optionIdx) => (
            <div key={option.value} className="flex items-center">
              <input
                value={option.value}
                id={`${title}-${optionIdx}`}
                name={option.value}
                checked={selectedFilters.some(i => option.value === i)}
                onChange={handleChange}
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`${title}-${optionIdx}`}
                className="ml-3 text-sm text-gray-600"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
