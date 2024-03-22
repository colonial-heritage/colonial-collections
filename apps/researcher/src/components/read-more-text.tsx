'use client';

import {useState} from 'react';

interface ReadMoreTextProps {
  text?: string;
  maxLength?: number;
}

export function ReadMoreText({text, maxLength = 300}: ReadMoreTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {isExpanded ? text : `${text.slice(0, maxLength)}... `}
      <button
        className="font-semibold underline"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? 'Read less' : 'Read more'}
      </button>
    </p>
  );
}
