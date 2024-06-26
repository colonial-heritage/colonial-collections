import {
  ListProvider,
  ListView,
  defaultImageFetchMode,
  defaultLimit,
} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from './sort-mapping';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <ListProvider
      baseUrl="/objects"
      defaultSortBy={defaultSortByUserOption}
      defaultImageFetchMode={defaultImageFetchMode}
      defaultView={ListView.Grid}
      defaultLimit={defaultLimit}
    >
      {children}
    </ListProvider>
  );
}
