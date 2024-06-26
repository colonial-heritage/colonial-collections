import {ListProvider, defaultLimit} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from '../objects/sort-mapping';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <ListProvider
      baseUrl="/objects"
      defaultSortBy={defaultSortByUserOption}
      defaultLimit={defaultLimit}
    >
      {children}
    </ListProvider>
  );
}
