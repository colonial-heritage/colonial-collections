import BaseLayout from '@/components/base-layout';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <body>
      <BaseLayout>
        <div className="mx-auto mt-16 px-4 sm:px-10 mb-16 max-w-3xl">
          {children}
        </div>
      </BaseLayout>
    </body>
  );
}
