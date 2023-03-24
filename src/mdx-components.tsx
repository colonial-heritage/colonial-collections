import type {MDXComponents} from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({children}) => (
      <h1 className="font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h1 className="font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    h3: ({children}) => (
      <h1 className="font-bold leading-tight tracking-tight text-gray-900">
        {children}
      </h1>
    ),
    p: ({children}) => <p className="text-gray-900 w-96">{children}</p>,
    ...components,
  };
}
