import BaseLayout from '@/components/base-layout';
import {
  ListProvider,
  ImageFetchMode,
  ListView,
} from '@colonial-collections/list-store';
import {defaultSortByUserOption} from './sort-mapping';
import {ReactNode} from 'react';

export default function ObjectLayout({children}: {children: ReactNode}) {
  return (
    <body>
      <BaseLayout>
        <ListProvider
          baseUrl="/objects"
          defaultSortBy={defaultSortByUserOption}
          defaultImageFetchMode={ImageFetchMode.Large}
          defaultView={ListView.Grid}
        >
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
