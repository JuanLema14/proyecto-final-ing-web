// /src/pages/admin/sucursales/index.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Definimos el tipo para una sucursal para que TypeScript nos ayude
type Sucursal = {
  id: number;
  nombre: string;
  ciudad: string;
};

export default function SucursalesPage() {
  const { data: session } = useSession();
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [nombre, setNombre] = useState('');
  const [ciudad, setCiudad] = useState('');

  // Función para cargar las sucursales desde la API
  const fetchSucursales = async () => {
    const res = await fetch('/api/sucursales');
    if (res.ok) {
      const data = await res.json();
      setSucursales(data);
    }
  };

  // Cargar las sucursales cuando el componente se monte
  useEffect(() => {
    fetchSucursales();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/sucursales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        ciudad,
        // Agregamos valores por defecto para los campos requeridos
        direccion: 'Dirección de Prueba',
        telefono: '1234567',
        emailContacto: 'test@test.com',
        horaApertura: new Date().toISOString(),
        horaCierre: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      alert('¡Sucursal creada!');
      fetchSucursales(); // Recargar la lista
      setNombre('');
      setCiudad('');
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sucursal?')) return;

    const res = await fetch(`/api/sucursales/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('Sucursal eliminada');
      fetchSucursales();
    } else {
      const error = await res.json();
      alert(`Error: ${error.message}`);
    }
  };

  const isAdmin = session?.user?.rol === 'Administrador General';

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Sucursales</h1>

      {/* Formulario para crear, solo visible para admins */}
      {isAdmin && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Crear Nueva Sucursal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <Input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <Input placeholder="Ciudad" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
              <Button type="submit">Crear</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de sucursales */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Sucursales</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {sucursales.map((sucursal) => (
              <li key={sucursal.id} className="flex justify-between items-center p-2 border-b">
                <span>{sucursal.nombre} - {sucursal.ciudad}</span>
                {/* Botón de eliminar, solo visible para admins */}
                {isAdmin && (
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(sucursal.id)}>
                    Eliminar
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}