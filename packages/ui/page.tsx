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
      className="text-2xl font-semibold leading-tight tracking-tight text-gray-900"
    >
      {children}
    </h1>
  );
}
