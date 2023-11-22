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
      className="inline-flex items-center mb-5 text-gray-900"
    >
      {children}
    </Link>
  );
}
