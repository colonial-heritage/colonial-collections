'use client';

import {Link} from '@/navigation';
import {useListHref} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

export default function BackButton({children}: {children: ReactNode}) {
  const href = useListHref();

  return (
    <Link
      data-testid="to-filtered-list-button"
      href={href}
      className="no-underline rounded-full px-2 py-1 sm:px-4 sm:py-2 text-xs md:text-sm bg-neutral-100 text-neutral-900 flex gap-1 items-center"
    >
      {children}
    </Link>
  );
}
