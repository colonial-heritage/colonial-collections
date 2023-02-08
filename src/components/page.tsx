import {ReactNode} from 'react';

export function PageHeader({children}: {children: ReactNode}) {
  return <header className="mb-5">{children}</header>;
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
    <section className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
      {children}
    </section>
  );
}

export function PageSidebarContainer({children}: {children: ReactNode}) {
  return (
    <div className="pb-24 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4">
      {children}
    </div>
  );
}

export function PageSidebar({children}: {children: ReactNode}) {
  return (
    <aside className="space-y-10 divide-y divide-gray-200">{children}</aside>
  );
}
