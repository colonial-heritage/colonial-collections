import BaseLayout from '@/components/base-layout';
import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from '../objects/sort-mapping';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortium-green-300 text-consortium-blue-800">
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
