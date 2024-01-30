import BaseLayout from '@/components/base-layout';
import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from '../objects/sort-mapping';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortiumGreen-300 text-consortiumBlue-800">
      <BaseLayout>
        <ListProvider
          baseUrl="/objects"
          defaultSortBy={defaultSortByUserOption}
        >
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
