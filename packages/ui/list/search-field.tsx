'use client';

import {useListStore} from '@colonial-collections/list-store';
import {MagnifyingGlassIcon} from '@heroicons/react/24/solid';
import {useTranslations} from 'next-intl';
import {useEffect, useState} from 'react';
import classNames from 'classnames';

interface SearchFieldProps {
  placeholder?: string;
  variant?: 'default' | 'home';
  onSearch?: (query: string) => void;
}

export function SearchField({
  placeholder = '',
  variant = 'default',
  onSearch,
}: SearchFieldProps) {
  const query = useListStore(s => s.query);
  const queryChange = useListStore(s => s.queryChange);
  const [inputText, setInputText] = useState(query);
  const t = useTranslations('Filters');
  const [isMounted, setIsMounted] = useState(false);

  // Wait for hydration to complete before enabling the input
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const inputClassName = classNames(
    'w-full rounded-l text-consortiumBlue-800',
    {
      'py-1 px-3 border border-consortiumBlue-800': variant === 'default',
      'p-3 placeholder:text-blueGrey-500 placeholder:italic text-consortiumBlue-800 not-italic':
        variant === 'home',
    }
  );

  const buttonClassName = classNames('rounded-r', {
    'bg-consortiumBlue-800 py-1 px-3 border-t border-b border-r border-consortiumBlue-800':
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
    if (onSearch) {
      onSearch(inputText);
    }
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
          disabled={!isMounted}
        />
        <button
          disabled={!isMounted}
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

interface SearchFieldWithLabelProps {
  onSearch?: (query: string) => void;
}

export function SearchFieldWithLabel({
  onSearch,
}: SearchFieldWithLabelProps = {}) {
  return (
    <div className="w-full max-w-[450px] relative" id="facets">
      <Label />
      <SearchField onSearch={onSearch} />
    </div>
  );
}
