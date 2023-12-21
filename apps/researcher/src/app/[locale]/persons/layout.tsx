import BaseLayout from '@/components/base-layout';
import {ListProvider, defaultSortBy} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <body>
      <BaseLayout>
        <ListProvider baseUrl="/persons" defaultSortBy={defaultSortBy}>
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
