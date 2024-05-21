import BaseLayout from '@/components/base-layout';
import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from './sort-mapping';
import {ReactNode} from 'react';
import {ImageVisibility, ListView} from './definitions';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body>
      <BaseLayout>
        <ListProvider
          baseUrl="/objects"
          defaultSortBy={defaultSortByUserOption}
          defaultImageVisibility={ImageVisibility.Large}
          defaultView={ListView.Grid}
        >
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
