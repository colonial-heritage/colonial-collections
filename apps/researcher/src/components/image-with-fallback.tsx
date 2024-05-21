'use client';

import React, {useState} from 'react';
import Image, {ImageProps} from 'next/image';
import {useTranslations} from 'next-intl';

export default function ImageWithFallback({
  src,
  alt,
  ...rest
  // Omit the key and ref props to prevent React warnings
}: Omit<ImageProps, 'key' | 'ref'>) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('Image');

  if (hasError) {
    return (
      <div className="border-b border-neutral-200 p-4">{t('errorText')}</div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className="bg-neutral-200 p-4 flex justify-center">
          <Image
            src="/images/image-placeholder.png"
            alt={alt}
            width="20"
            height="20"
            className="animate-pulse"
          />
        </div>
      )}
      <Image
        {...rest}
        alt={alt}
        src={src}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
