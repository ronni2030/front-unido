# Hooks de React Query (Opcional)

Los hooks en este directorio usan `@tanstack/react-query` para una mejor gestión del estado del servidor.

## Instalación de React Query

Si deseas usar estos hooks, instala React Query:

```bash
npm install @tanstack/react-query
# o
yarn add @tanstack/react-query
# o
pnpm add @tanstack/react-query
```

## Configuración en tu App

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Tu app aquí */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Uso Alternativo sin React Query

Si prefieres no usar React Query, puedes usar los servicios directamente con `useState` y `useEffect`:

```typescript
import { useEffect, useState } from 'react';
import { usuariosService } from '@/services';
import type { User } from '@/features/users/types';

function UsuariosList() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true);
        const data = await usuariosService.getAll();
        setUsuarios(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {usuarios.map(user => (
        <div key={user.id}>{user.nameUsers}</div>
      ))}
    </div>
  );
}
```
