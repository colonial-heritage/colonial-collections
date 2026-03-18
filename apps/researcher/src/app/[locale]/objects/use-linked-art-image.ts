'use client';

import {useEffect, useState} from 'react';
import {resolveLinkedArtImages} from '@/lib/resolve-linked-art-images';

export function useLinkedArtImage(
  mainEntityOfPage: string | undefined,
  shouldResolve: boolean
): string | undefined {
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    if (!shouldResolve || !mainEntityOfPage) return;
    let cancelled = false;
    resolveLinkedArtImages(mainEntityOfPage).then(images => {
      if (!cancelled && images.length > 0) {
        setImageUrl(images[0].contentUrl);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [mainEntityOfPage, shouldResolve]);

  return imageUrl;
}
