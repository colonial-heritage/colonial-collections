import {ListProvider, defaultSortBy} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <ListProvider baseUrl="/" defaultSortBy={defaultSortBy}>
      {children}
    </ListProvider>
  );
}
