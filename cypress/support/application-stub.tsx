import '../../src/app/[locale]/globals.css';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {ReactNode} from 'react';

export default function ApplicationStub({children}: {children: ReactNode}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Turns retries off
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
