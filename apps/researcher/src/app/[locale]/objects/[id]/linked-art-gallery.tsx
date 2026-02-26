'use client';

import {useEffect, useState} from 'react';
import {
  resolveLinkedArtImages,
  type ResolvedImage,
} from '@/lib/resolve-linked-art-images';
import Gallery from './gallery';

interface Props {
  mainEntityOfPage: string;
  objectName?: string;
  organizationName?: string;
}

export default function LinkedArtGallery({
  mainEntityOfPage,
  objectName,
  organizationName,
}: Props) {
  const [images, setImages] = useState<ResolvedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    resolveLinkedArtImages(mainEntityOfPage).then(resolved => {
      if (!cancelled) {
        setImages(resolved);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [mainEntityOfPage]);

  if (isLoading) {
    return (
      <div className="w-full aspect-square max-h-[450px] bg-neutral-100 animate-pulse rounded" />
    );
  }

  if (images.length === 0) {
    return null;
  }

  const galleryImages = images.map((image, i) => ({
    id: image.id,
    src: image.contentUrl,
    alt: `${objectName ?? 'Image'} #${i + 1}`,
    license: image.license,
  }));

  return <Gallery images={galleryImages} organizationName={organizationName} />;
}
