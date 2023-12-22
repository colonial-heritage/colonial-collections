import BaseLayout from '@/components/base-layout';
import {ListProvider, defaultSortBy} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortiumBlue-800 text-white">
      <BaseLayout>
        <ListProvider baseUrl="/objects" defaultSortBy={defaultSortBy}>
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
