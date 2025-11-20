# 🔄 State Management Architecture

## Overview

This document outlines the state management strategy for the Employer Portal, including global state, local state, and server state management.

## State Management Strategy

### Three-Tier Architecture

1. **Global State** (Zustand/Redux) - Shared across components
2. **Local State** (React Hooks) - Component-specific
3. **Server State** (React Query/SWR) - API data caching

## Global State (Zustand)

### Store Structure

```typescript
// stores/employer/employerStore.ts
interface EmployerStore {
  // Auth & Profile
  employer: Employer | null;
  isAuthenticated: boolean;
  
  // UI State
  sidebarOpen: boolean;
  activeTab: string;
  theme: 'light' | 'dark';
  
  // Filters & Search
  jobFilters: JobFilters;
  applicantFilters: ApplicantFilters;
  searchQuery: string;
  
  // Selections
  selectedJobs: string[];
  selectedApplicants: string[];
  
  // Actions
  setEmployer: (employer: Employer) => void;
  setSidebarOpen: (open: boolean) => void;
  setJobFilters: (filters: JobFilters) => void;
  // ... more actions
}
```

### Store Slices

#### 1. Auth Store
```typescript
interface AuthStore {
  employer: Employer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

#### 2. UI Store
```typescript
interface UIStore {
  sidebarOpen: boolean;
  activeTab: string;
  modals: Record<string, boolean>;
  notifications: Notification[];
  setSidebarOpen: (open: boolean) => void;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  addNotification: (notification: Notification) => void;
}
```

#### 3. Filter Store
```typescript
interface FilterStore {
  jobFilters: JobFilters;
  applicantFilters: ApplicantFilters;
  searchQuery: string;
  setJobFilters: (filters: JobFilters) => void;
  setApplicantFilters: (filters: ApplicantFilters) => void;
  clearFilters: () => void;
}
```

## Server State (React Query)

### Query Configuration

```typescript
// lib/react-query/config.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### Query Hooks

#### Jobs Queries
```typescript
// hooks/useJobs.ts
export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useJob(jobId: string) {
  return useQuery({
    queryKey: ['job', jobId],
    queryFn: () => fetchJob(jobId),
    enabled: !!jobId,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
    },
  });
}
```

#### Applications Queries
```typescript
// hooks/useApplications.ts
export function useApplications(jobId?: string, filters?: ApplicantFilters) {
  return useQuery({
    queryKey: ['applications', jobId, filters],
    queryFn: () => fetchApplications(jobId, filters),
  });
}

export function useUpdateApplicationStage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateApplicationStage,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['applications']);
      queryClient.invalidateQueries(['application', data.id]);
    },
  });
}
```

## Local State (React Hooks)

### Component State
```typescript
// Component example
function JobForm() {
  // Local form state
  const [formData, setFormData] = useState<JobFormData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Server state
  const { data: job } = useJob(jobId);
  const createJob = useCreateJob();
  
  // Global state
  const { setJobFilters } = useFilterStore();
  
  // Handle form submission
  const handleSubmit = async (data: JobFormData) => {
    setIsSubmitting(true);
    try {
      await createJob.mutateAsync(data);
      // Success handling
    } catch (error) {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    // Form JSX
  );
}
```

## State Persistence

### LocalStorage Persistence
```typescript
// Persist filters to localStorage
useEffect(() => {
  const savedFilters = localStorage.getItem('jobFilters');
  if (savedFilters) {
    setJobFilters(JSON.parse(savedFilters));
  }
}, []);

useEffect(() => {
  localStorage.setItem('jobFilters', JSON.stringify(jobFilters));
}, [jobFilters]);
```

### Session Persistence
```typescript
// Persist auth state
const authStore = useAuthStore();
useEffect(() => {
  const savedAuth = sessionStorage.getItem('auth');
  if (savedAuth) {
    authStore.setEmployer(JSON.parse(savedAuth));
  }
}, []);
```

## State Synchronization

### Optimistic Updates
```typescript
export function useUpdateApplicationStage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateApplicationStage,
    onMutate: async (newStage) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['applications']);
      
      // Snapshot previous value
      const previousApplications = queryClient.getQueryData(['applications']);
      
      // Optimistically update
      queryClient.setQueryData(['applications'], (old: any) => {
        return old.map((app: Application) =>
          app.id === newStage.applicationId
            ? { ...app, stage: newStage.stage }
            : app
        );
      });
      
      return { previousApplications };
    },
    onError: (err, newStage, context) => {
      // Rollback on error
      queryClient.setQueryData(['applications'], context.previousApplications);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['applications']);
    },
  });
}
```

## Real-time State Updates

### WebSocket Integration
```typescript
// hooks/useWebSocket.ts
export function useWebSocket(event: string, callback: (data: any) => void) {
  const socket = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    socket.current = new WebSocket(WS_URL);
    
    socket.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === event) {
        callback(data.payload);
      }
    };
    
    return () => {
      socket.current?.close();
    };
  }, [event, callback]);
}

// Usage
function ApplicationsList() {
  const queryClient = useQueryClient();
  
  useWebSocket('application.received', (application) => {
    queryClient.setQueryData(['applications'], (old: any) => {
      return [application, ...old];
    });
  });
  
  // Component JSX
}
```

## State Debugging

### Redux DevTools Integration
```typescript
// Zustand with Redux DevTools
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      // Store implementation
    }),
    { name: 'EmployerStore' }
  )
);
```

### React Query DevTools
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* App */}
      </QueryClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

## Best Practices

### 1. State Location
- **Global**: Shared across multiple components
- **Server**: API data, use React Query
- **Local**: Component-specific, use useState

### 2. State Updates
- Use mutations for server updates
- Optimistic updates for better UX
- Error handling and rollback
- Invalidate related queries

### 3. Performance
- Memoize expensive computations
- Use selectors to prevent unnecessary re-renders
- Debounce search/filter inputs
- Virtualize long lists

### 4. Type Safety
- Type all state interfaces
- Use TypeScript strictly
- Validate state at boundaries
- Use Zod for runtime validation

## Future Enhancements

1. **State Machine**
   - XState for complex flows
   - Pipeline state management
   - Job status transitions

2. **Offline Support**
   - Service Worker caching
   - Offline queue
   - Sync on reconnect

3. **State Persistence**
   - IndexedDB for large data
   - Compress stored data
   - Selective persistence

4. **State Analytics**
   - Track state changes
   - Performance monitoring
   - Debugging tools

