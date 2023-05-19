import {ReactNode} from 'react';

interface HeaderProps {
  children: ReactNode;
}

export function H2({children}: HeaderProps) {
  return <h2 className="font-semibold uppercase text-lg">{children}</h2>;
}

export function H3({children}: HeaderProps) {
  return <h3 className="font-semibold uppercase text-gray-800">{children}</h3>;
}
