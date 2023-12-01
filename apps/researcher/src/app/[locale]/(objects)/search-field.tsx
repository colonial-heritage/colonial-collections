'use client';

import {useListStore} from '@colonial-collections/list-store';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import {useRouter} from 'next-intl/client';
import {useState} from 'react';

export function SearchField({placeholder = ''}: {placeholder?: string}) {
  const query = useListStore(s => s.query);
  const [inputText, setInputText] = useState(query);
  const t = useTranslations('Filters');
  const router = useRouter();

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const search = () => {
    const urlSearchParams = new URLSearchParams({query: inputText});
    router.replace(`/?${urlSearchParams}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <div className="w-full flex justify-between">
      <input
        data-testid="searchQuery"
        value={inputText}
        onChange={handleQueryChange}
        type="text"
        name="search"
        id="search"
        className="p-3 rounded-l placeholder:text-blueGrey-500 placeholder:italic w-full text-consortiumBlueOld-800 not-italic"
        aria-label={t('accessibilityTypeToFilter')}
        placeholder={placeholder}
        onKeyUp={handleKeyPress}
      />
      <button
        className="flex items-center p-3 rounded-r bg-consortiumGreen-300"
        aria-label={t('accessibilityTypeToFilter')}
        onClick={search}
      >
        <MagnifyingGlassIcon className="w-6 h-6 fill-consortiumBlue-800" />
      </button>
    </div>
  );
}
