import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  // Extiende la interfaz de la Sesión
  interface Session {
    user: {
      id: number;
      rol?: string; // El rol del usuario
    } & DefaultSession['user'];
  }

  // Extiende la interfaz del usuario que viene desde la base de datos
  interface User {
    rol?: string;
  }
}

declare module 'next-auth/jwt' {
  // Extiende la interfaz del token JWT
  interface JWT {
    id: number;
    rol?: string;
  }
}