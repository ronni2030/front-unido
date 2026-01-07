// Servicio API para operaciones de usuarios
export class UsersApiService {
  private static readonly BASE_URL = 'http://localhost:8888';

  static async saveUser(userData: { name: string; email: string; phone: string }) {
    console.log('Intentando guardar:', userData);
    try {
      const response = await fetch(`${this.BASE_URL}/usuarios/crear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nameUsers: userData.name,
          emailUser: userData.email,
          userName: userData.name, // Ahora ambos tienen el mismo nombre
          passwordUser: 'OpenBlind123', // Password por defecto
          phoneUser: userData.phone
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Usuario guardado exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error completo:', error);
      throw error;
    }
  }

  static async getUser(id: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/usuarios/${id}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  static async updateUser(id: string, userData: Partial<{ name: string; email: string; phone: string }>) {
    try {
      const response = await fetch(`${this.BASE_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw error;
    }
  }

  static async deleteUser(id: string) {
    try {
      const response = await fetch(`${this.BASE_URL}/usuarios/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw error;
    }
  }
}