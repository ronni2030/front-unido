import { useState, useEffect } from 'react';
import api from '../services/api/client';
import { Layout } from '../shared/components/layout/Layout';

export const ConnectionTest = () => {
    const [status, setStatus] = useState<string>('Verificando conexión...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const response = await api.get('/');
                setStatus(`Conectado exitosamente: ${response.data?.message || 'OK'}`);
            } catch (err: any) {
                console.error('Error de conexión:', err);
                setError(`Error conectando: ${err.message}. Asegúrate que el backend esté corriendo en el puerto 8888.`);
            }
        };

        checkConnection();
    }, []);

    return (
        <Layout>
            <div className="p-4 m-4 border rounded shadow-md bg-white">
                <h2 className="text-xl font-bold mb-2">Estado de Conexión Backend</h2>
                {error ? (
                    <div className="text-red-500 font-medium">❌ {error}</div>
                ) : (
                    <div className="text-green-600 font-medium">✅ {status}</div>
                )}
            </div>
        </Layout>
    );
};

