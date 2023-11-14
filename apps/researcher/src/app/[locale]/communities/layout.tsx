import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortBy} from '@/lib/community';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <ListProvider baseUrl="/communities" defaultSortBy={defaultSortBy}>
      {children}
    </ListProvider>
  );
}
