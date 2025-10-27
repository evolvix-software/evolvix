import { ReactNode } from 'react';
import { StoreProvider } from '../providers/StoreProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  );
}
