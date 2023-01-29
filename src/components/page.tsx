import {ReactNode} from 'react';

export function PageHeader({children}: {children: ReactNode}) {
  return (
    <header>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </header>
  );
}

export function PageTitle({children}: {children: ReactNode}) {
  return (
    <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
      {children}
    </h1>
  );
}

export function PageContent({children}: {children: ReactNode}) {
  return (
    <main>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}
