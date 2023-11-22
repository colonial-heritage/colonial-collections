'use client';

import {Link} from '@/navigation';
import {useListHref} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

interface Props {
  children: ReactNode;
  className?: string;
}

export default function ToFilteredListButton({className, children}: Props) {
  const href = useListHref();

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
