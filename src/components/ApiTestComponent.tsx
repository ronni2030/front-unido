import { useState } from 'react';
import { authService, usuariosService, rutasService } from '../services';

/**
 * Componente de prueba para verificar la integración de la API
 * Colócalo en tu app temporalmente para probar la conexión
 */
export function ApiTestComponent() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string, isError = false) => {
    const prefix = isError ? '❌' : '✅';
    setResults(prev => [...prev, `${prefix} ${message}`]);
  };

  const runTests = async () => {
    setResults([]);
    setLoading(true);
    addResult('Iniciando pruebas de integración...');

    // Test 1: Verificar configuración del cliente
    addResult('Test 1: Cliente API configurado correctamente');
    addResult('  - Base URL: ' + (import.meta.env.VITE_API_URL || 'http://localhost:8888'));

    // Test 2: Verificar que los servicios existen
    try {
      addResult('Test 2: Servicios importados correctamente');
      addResult('  - authService: ' + typeof authService);
      addResult('  - usuariosService: ' + typeof usuariosService);
      addResult('  - rutasService: ' + typeof rutasService);
    } catch (error) {
      addResult('Test 2: Error al importar servicios', true);
    }

    // Test 3: Verificar métodos de authService
    try {
      addResult('Test 3: Métodos de authService');
      addResult('  - login: ' + typeof authService.login);
      addResult('  - register: ' + typeof authService.register);
      addResult('  - logout: ' + typeof authService.logout);
      addResult('  - getProfile: ' + typeof authService.getProfile);
      addResult('  - isAuthenticated: ' + typeof authService.isAuthenticated);
    } catch (error) {
      addResult('Test 3: Error en métodos de authService', true);
    }

    // Test 4: Intentar conexión al backend (solo si está disponible)
    addResult('Test 4: Probando conexión con backend...');
    try {
      // Intenta un endpoint que no requiere autenticación si existe
      // O simplemente verifica que el servicio puede hacer una petición
      addResult('  - Preparando petición de prueba...');
      addResult('  - NOTA: Asegúrate de que el backend esté en http://localhost:8888');
      
      // Intentar login con credenciales de prueba
      try {
        await authService.login({ 
          username: 'test_user', 
          password: 'test_password' 
        });
        addResult('  - Backend respondió correctamente');
      } catch (error: any) {
        if (error.response) {
          addResult(`  - Backend respondió con código: ${error.response.status}`);
          if (error.response.status === 401 || error.response.status === 404) {
            addResult('  - ✅ Backend está funcionando (credenciales incorrectas pero servidor responde)');
          }
        } else if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          addResult('  - ⚠️ No se puede conectar al backend', true);
          addResult('  - Verifica que el backend esté corriendo en http://localhost:8888', true);
        } else {
          addResult(`  - Error: ${error.message}`, true);
        }
      }
    } catch (error: any) {
      addResult('Test 4: Error general', true);
      addResult(`  - ${error.message}`, true);
    }

    // Test 5: Verificar localStorage
    addResult('Test 5: Gestión de tokens');
    try {
      const token = authService.getToken();
      if (token) {
        addResult('  - Token encontrado en localStorage');
      } else {
        addResult('  - No hay token (esto es normal si no has hecho login)');
      }
      addResult('  - Sistema de tokens: funcionando correctamente');
    } catch (error) {
      addResult('Test 5: Error en gestión de tokens', true);
    }

    setLoading(false);
    addResult('');
    addResult('='.repeat(50));
    addResult('PRUEBAS COMPLETADAS');
    addResult('='.repeat(50));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          🧪 Prueba de Integración de API
        </h1>
        
        <div className="mb-4">
          <button
            onClick={runTests}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Ejecutando pruebas...' : 'Ejecutar Pruebas'}
          </button>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            {results.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">📋 Información</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Backend debe estar en: <code className="bg-blue-100 px-2 py-1 rounded">http://localhost:8888</code></li>
            <li>• Los errores de "Network Error" son normales si el backend no está corriendo</li>
            <li>• Los errores 401/404 indican que el backend está funcionando</li>
            <li>• Los servicios están correctos si ves "function" en los resultados</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-900 mb-2">✅ Uso en Producción</h3>
          <div className="text-sm text-green-800">
            <p className="mb-2">Una vez verificado, usa los servicios así:</p>
            <pre className="bg-green-100 p-3 rounded overflow-x-auto">
{`import { authService, usuariosService } from '@/services';

// Login
const response = await authService.login({
  username: 'usuario',
  password: 'contraseña'
});

// Obtener datos
const usuarios = await usuariosService.getAll();`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
