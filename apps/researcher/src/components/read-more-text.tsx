'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';

interface ReadMoreTextProps {
  text?: string;
  maxLength?: number;
}

export function ReadMoreText({text, maxLength = 300}: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations('ReadMoreText');

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return text;
  }

  return (
    <>
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <button
        className="font-semibold underline"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? t('readLess') : t('readMore')}
      </button>
    </>
  );
}
