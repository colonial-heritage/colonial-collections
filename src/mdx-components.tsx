import type {MDXComponents} from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({children}) => (
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h3: ({children}) => (
      <h1 className="text-1xl font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    ...components,
  };
}
