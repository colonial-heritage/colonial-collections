'use client';

import {useListStore} from '@colonial-collections/list-store';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import classNames from 'classnames';

interface SearchFieldProps {
  placeholder?: string;
  variant?: 'default' | 'home';
}

export function SearchField({
  placeholder = '',
  variant = 'default',
}: SearchFieldProps) {
  const query = useListStore(s => s.query);
  const queryChange = useListStore(s => s.queryChange);
  const [inputText, setInputText] = useState(query);
  const t = useTranslations('Filters');

  const inputClassName = classNames('w-full rounded-l', {
    'py-1 px-3 border border-neutral-700': variant === 'default',
    'p-3 placeholder:text-blueGrey-500 placeholder:italic text-consortiumBlueOld-800 not-italic':
      variant === 'home',
  });

  const buttonClassName = classNames('rounded-r', {
    'bg-neutral-700 py-1 px-3 border-t border-b border-r border-neutral-700':
      variant === 'default',
    'flex items-center p-3 bg-consortiumGreen-300': variant === 'home',
  });

  const magnifyingGlassClassName = classNames({
    'w-4 h-4 fill-white': variant === 'default',
    'w-6 h-6 fill-consortiumBlue-800': variant === 'home',
  });

  useEffect(() => {
    setInputText(query);
  }, [query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const search = () => {
    queryChange(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search();
    }
  };

  return (
    <>
      <div className="w-full flex justify-between">
        <input
          data-testid="searchQuery"
          value={inputText}
          onChange={handleQueryChange}
          type="text"
          name="search"
          id="search"
          className={inputClassName}
          aria-label={t('accessibilityTypeToFilter')}
          placeholder={placeholder}
          onKeyUp={handleKeyPress}
        />
        <button
          className={buttonClassName}
          aria-label={t('accessibilityTypeToFilter')}
          onClick={search}
        >
          <MagnifyingGlassIcon className={magnifyingGlassClassName} />
        </button>
      </div>
    </>
  );
}

function Label() {
  const t = useTranslations('Filters');

  return (
    <label htmlFor="search" className="font-semibold">
      {t('search')}
    </label>
  );
}

export function SearchFieldWithLabel() {
  return (
    <div className="w-full max-w-[450px] relative" id="facets">
      <Label />
      <SearchField />
    </div>
  );
}
