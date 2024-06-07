import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortBy} from '@/lib/community/actions';
import {ReactNode} from 'react';
import {limit} from './settings';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <ListProvider
      baseUrl="/communities"
      defaultSortBy={defaultSortBy}
      defaultLimit={limit}
    >
      <div>{children}</div>
    </ListProvider>
  );
}
