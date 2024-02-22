'use client';

import React, {useState} from 'react';
import Image, {ImageProps} from 'next/image';
import {useTranslations} from 'next-intl';

export default function ImageWithFallback({src, alt, ...rest}: ImageProps) {
  const [hasError, setHasError] = useState(false);
  const t = useTranslations('Image');

  if (hasError) {
    return (
      <div className="border-b border-neutral-200 p-4">{t('errorText')}</div>
    );
  }

  return (
    <Image {...rest} alt={alt} src={src} onError={() => setHasError(true)} />
  );
}
