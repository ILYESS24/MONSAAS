# Architecture Documentation

## Overview

Aurion Studio follows a **feature-based modular architecture** with clear separation of concerns, designed for scalability, maintainability, and testability.

## Directory Structure

```
src/
├── apps/                # 🆕 Micro-frontend applications
│   └── index.ts        # App registry and event bus
│
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared components (ErrorBoundary, etc.)
│   ├── fabrica/        # Feature-specific components
│   └── ui/             # Base UI components (buttons, inputs, etc.)
│
├── config/             # Application configuration
│   └── index.ts        # Centralized config (API, features, etc.)
│
├── constants/          # Static constants
│   └── index.ts        # Routes, storage keys, events, etc.
│
├── contexts/           # React Context providers
│   ├── AppContext.tsx  # Global app state
│   └── NotificationContext.tsx
│
├── hooks/              # Custom React hooks
│   ├── useLiveData.ts  # Real-time data hooks
│   ├── useAnalytics.ts # Analytics tracking
│   └── ...
│
├── layouts/            # Page layouts
│   ├── MainLayout.tsx  # Standard layout
│   ├── DashboardLayout.tsx
│   ├── AuthLayout.tsx
│   └── ToolLayout.tsx
│
├── lib/                # Utility libraries
│   ├── api.ts          # API client
│   ├── logger.ts       # Logging utility
│   ├── validation.ts   # Form validation
│   ├── queryClient.ts  # 🆕 React Query configuration
│   └── ...
│
├── pages/              # Page components
│   ├── Dashboard.tsx
│   ├── SignIn.tsx
│   └── ...
│
├── providers/          # Application providers
│   └── AppProviders.tsx # Combined providers (includes React Query)
│
├── router/             # Routing configuration
│   ├── routes.ts       # Route definitions
│   └── AppRouter.tsx   # Router component
│
├── services/           # Business logic services
│   ├── api.service.ts  # API service layer
│   ├── auth.service.ts # Authentication service
│   └── analytics.service.ts
│
├── store/              # 🆕 Zustand state management
│   └── index.ts        # Global stores (App, User, Dashboard, Notifications)
│
├── types/              # TypeScript type definitions
│   └── supabase.ts     # Database types
│
├── App.tsx             # Root component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Architecture Layers

### 1. Presentation Layer (components/, pages/, layouts/)

- **UI Components**: Reusable, stateless components
- **Pages**: Container components that connect to services
- **Layouts**: Structural components that wrap pages

### 2. State Management (store/, contexts/, hooks/)

- **Zustand Stores**: Global state with persistence and devtools
  - `useAppStore`: Theme, sidebar, loading states
  - `useUserStore`: User authentication state
  - `useDashboardStore`: Dashboard data and statistics
  - `useNotificationStore`: Notification management
- **Contexts**: React Context for provider-based state
- **Hooks**: Encapsulated state logic and side effects

### 3. Data Fetching (lib/queryClient.ts)

- **React Query**: Server state management
  - Automatic caching (5 min stale, 30 min cache)
  - Background refetching
  - Retry with exponential backoff
  - Query key management via `queryKeys` object

### 4. Service Layer (services/)

- **API Services**: Data fetching and manipulation
- **Auth Service**: Authentication operations
- **Analytics Service**: Event tracking

### 5. Utility Layer (lib/)

- **API Client**: HTTP request handling
- **Logger**: Centralized logging
- **Validation**: Form and data validation

### 6. Configuration Layer (config/, constants/)

- **Config**: Environment-specific settings
- **Constants**: Static values and enums

### 7. Micro-Frontend Layer (apps/)

- **App Registry**: Centralized app definitions
- **Event Bus**: Inter-app communication
- **Shared Modules**: Code sharing between apps

## Design Patterns

### 1. Module Pattern
Each directory has an `index.ts` for clean imports:
```typescript
import { Button, Card } from '@/components/ui';
```

### 2. Provider Pattern
Contexts provide global state and utilities:
```typescript
const { showToast, showError } = useNotificationContext();
```

### 3. Service Pattern
Services encapsulate business logic:
```typescript
const projects = await projectsService.getAll();
```

### 4. Custom Hooks Pattern
Complex logic extracted into hooks:
```typescript
const { stats, isLoading } = useLiveStats();
```

### 5. Compound Component Pattern
Complex UI from composable parts:
```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Content>Content</Card.Content>
</Card>
```

### 6. Zustand Store Pattern (NEW)
Global state with type-safe selectors:
```typescript
// Using the store
const theme = useAppStore((state) => state.theme);
const setTheme = useAppStore((state) => state.setTheme);

// With selectors for optimization
const stats = useDashboardStore(selectStats);
```

### 7. React Query Pattern (NEW)
Data fetching with automatic caching:
```typescript
// Query keys for cache management
import { queryKeys } from '@/lib/queryClient';

// Using queries
const { data, isLoading } = useQuery({
  queryKey: queryKeys.dashboard.stats(),
  queryFn: fetchDashboardStats,
});
```

### 8. Event Bus Pattern (NEW)
Inter-app communication:
```typescript
import { eventBus, AppEvents } from '@/apps';

// Subscribe to events
const unsubscribe = eventBus.on(AppEvents.DASHBOARD_REFRESH, (data) => {
  console.log('Dashboard refresh requested', data);
});

// Emit events
eventBus.emit(AppEvents.STATS_UPDATED, { totalSales: 25000 });
```

## Data Flow

```
User Action → Component → Hook/Context → Service → API
                ↓
            State Update
                ↓
        Component Re-render
```

### Enhanced Data Flow with React Query & Zustand

```
User Action
    ↓
Component → useQuery (React Query) → API → Cache
    ↓
Zustand Store (client state) ← Server Response
    ↓
Component Re-render
```

## Security Architecture

1. **Authentication**: Clerk-based with protected routes
2. **API Security**: Token-based, validated on server
3. **XSS Protection**: Content Security Policy headers
4. **CSRF Protection**: SameSite cookies
5. **Iframe Security**: Sandbox attributes, origin validation

## Performance Optimizations

1. **Code Splitting**: React.lazy() for routes
2. **Memoization**: useMemo, useCallback where appropriate
3. **Debouncing**: Search and filter operations
4. **Lazy Loading**: Images and non-critical resources

## Testing Strategy

1. **Unit Tests**: Services, utilities, hooks
2. **Integration Tests**: Component interactions
3. **E2E Tests**: Critical user flows

## Best Practices

1. **Single Responsibility**: Each module has one purpose
2. **DRY**: Shared logic in hooks and services
3. **Type Safety**: Full TypeScript coverage
4. **Error Handling**: Centralized with ErrorBoundary
5. **Logging**: Structured logging with levels
