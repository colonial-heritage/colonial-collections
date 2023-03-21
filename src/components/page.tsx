import {ReactNode} from 'react';

export function PageHeader({children}: {children: ReactNode}) {
  return <header className="mb-5">{children}</header>;
}

interface PageTitleProps {
  children: ReactNode;
  id?: string;
}

export function PageTitle({children, id}: PageTitleProps) {
  return (
    <h1
      id={id}
      data-testid="page-title"
      className="text-2xl font-bold leading-tight tracking-tight text-gray-900"
    >
      {children}
    </h1>
  );
}

export function PageContent({children}: {children: ReactNode}) {
  return (
    <section className="w-full md:w-2/3 gap-6 flex flex-col py-8">
      {children}
    </section>
  );
}

export function PageWithSidebarContainer({children}: {children: ReactNode}) {
  return (
    <div className="max-w-7xl container mx-auto flex flex-col md:flex-row justify-between gap-6 px-8">
      {children}
    </div>
  );
}

export function PageSidebar({children}: {children: ReactNode}) {
  return (
    <aside className="self-stretch hidden md:flex md:h-full w-full md:w-1/3 flex-row md:flex-col gap-10 overscroll-x-auto flex-nowrap border-white border-r-2 py-8">
      {children}
    </aside>
  );
}
