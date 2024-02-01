import BaseLayout from '@/components/base-layout';
import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <body>
      <BaseLayout>{children}</BaseLayout>
    </body>
  );
}
