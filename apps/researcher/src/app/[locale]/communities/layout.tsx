import BaseLayout from '@/components/base-layout';
import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortBy} from '@/lib/community/actions';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortiumGreen-300 text-consortiumBlue-800">
      <BaseLayout>
        <ListProvider baseUrl="/communities" defaultSortBy={defaultSortBy}>
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
