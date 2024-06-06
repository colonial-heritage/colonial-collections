import {ReactNode} from 'react';

export default function Layout({children}: {children: ReactNode}) {
  return (
    <main className="w-full px-4 sm:px-10 max-w-7xl mx-auto mt-20">
      {children}
    </main>
  );
}
