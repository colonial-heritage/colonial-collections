import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortBy} from '@/lib/community/actions';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <ListProvider baseUrl="/communities" defaultSortBy={defaultSortBy}>
      <div>{children}</div>
    </ListProvider>
  );
}
