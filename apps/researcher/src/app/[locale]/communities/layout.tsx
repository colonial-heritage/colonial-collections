import BaseLayout from '@/components/base-layout';
import {ListProvider} from '@colonial-collections/list-store';
import {defaultSortBy} from '@/lib/community/actions';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <body className="bg-consortiumGreen-300 text-consortiumBlue-800">
      <BaseLayout wrapperClassName="mx-auto h-full min-h-screen flex flex-col justify-stretch items-stretch gap-8 pb-40">
        <ListProvider baseUrl="/communities" defaultSortBy={defaultSortBy}>
          {children}
        </ListProvider>
      </BaseLayout>
    </body>
  );
}
