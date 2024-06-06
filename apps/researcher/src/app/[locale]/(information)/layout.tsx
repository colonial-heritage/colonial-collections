import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <main className="mx-auto mt-16 px-4 sm:px-10 mb-16 max-w-3xl grow">
      {children}
    </main>
  );
}
