# 🍽️ Restaurante App - Sistema de Gestión Integral

## 🌟 Descripción

Un sistema completo para la gestión de restaurantes que incluye:
- Control de inventario 📦
- Gestión de Sucursales 🧾
- Administración de empleados 👨‍🍳

## 🚀 Cómo Empezar

### Prueba la App en Vercel
🔗 **Acceso en vivo:** [https://proyecto-final-ing-web-pearl.vercel.app](https://proyecto-final-ing-web-pearl.vercel.app)

👤 **Usuario de prueba:**  
📧 Email: `admin@restaurante.com`  
🔑 Contraseña: `123456`

### Instalación Local

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/proyecto-final-ing-web.git

# Entra al directorio
cd proyecto-final-ing-web

# Instala dependencias
npm install

# Configura variables de entorno
.env

# Inicia el servidor de desarrollo
npm run dev
```

## 🛠️ Tecnologías Utilizadas

| Categoría       | Tecnologías                                                                |
|-----------------|----------------------------------------------------------------------------|
| Frontend        | Next.js 13, React 18, TypeScript, Tailwind CSS, Shadcn/ui                  |
| Backend         | Next.js API Routes, Prisma ORM                                             |
| Autenticación   | NextAuth.js                                                                |
| Base de Datos   | PostgreSQL (Vercel Postgres)                                               |
| Deployment      | Vercel                                                                     |
| Herramientas    | ESLint, Prettier                                                           |

## 📦 Estructura del Proyecto

```
proyecto-final-ing-web/src
├── app/
│   ├── api/                  # Endpoints API
│   ├── auth/                 # Configuración de autenticación
│   ├── main/                 # Rutas principales de la aplicación
│   └── lib/                  # Funciones compartidas
├── components/               # Componentes reutilizables
├── prisma/                   # Esquema y migraciones de la base de datos
└── public/                   # Assets estáticos
```

## 🔍 Características Principales

### 1. Gestión de Inventario
- 📊 Visualización de stock en tiempo real
- 📝 Registro de movimientos

### 2. Administración de Órdenes
- 🖥️ Interfaz intuitiva para meseros

### 3. Panel de Administración
- 👥 Gestión de empleados

## 🧑‍💻 Desarrollo

### Configuración Inicial

1. **Base de Datos**:
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

2. **Variables de Entorno**:
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="tu-secreto-seguro"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### Scripts Útiles

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "format": "prettier --write .",
    "prisma:studio": "npx prisma studio"
  }
}
```

## 🐛 Solución de Problemas

**Problema:** Error de conexión a la base de datos  
✅ **Solución:** Verifica que `DATABASE_URL` esté correctamente configurada en `.env`

**Problema:** Problemas de autenticación  
✅ **Solución:** Asegúrate que `NEXTAUTH_SECRET` esté definida y sea segura


## 📄 Licencia

© 2025 JuanLema14

---

✨ **¡Gracias por probar nuestra aplicación!** ✨  
¿Preguntas o sugerencias? ¡Abre un issue en GitHub!