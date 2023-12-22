import BaseLayout from '@/components/base-layout';
import {ListProvider, defaultSortBy} from '@colonial-collections/list-store';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortiumGreen-300 text-consortiumBlue-800">
      <BaseLayout>
        <ListProvider baseUrl="/objects" defaultSortBy={defaultSortBy}>
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
