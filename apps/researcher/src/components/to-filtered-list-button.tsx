'use client';

import {getLastSearch} from '@/lib/last-search';
import {Link} from '@/navigation';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  baseUrl: string;
}

export default function ToFilteredListButton({
  className,
  baseUrl,
  children,
}: Props) {
  const href = getLastSearch(baseUrl);

  return (
    <Link
      href={href}
      className={className}
      data-testid="to-filtered-list-button"
    >
      {children}
    </Link>
  );
}
