'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function EditarSucursalPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    ciudad: '',
    telefono: '',
    emailContacto: '',
    horaApertura: '',
    horaCierre: '',
  });

  // Cargar los datos actuales de la sucursal
  useEffect(() => {
    const fetchSucursal = async () => {
      try {
        const res = await fetch(`/api/sucursales/${id}`);
        const data = await res.json();

        setForm({
          ...data,
          horaApertura: data.horaApertura.slice(11, 16), // "08:00"
          horaCierre: data.horaCierre.slice(11, 16),
        });
      } catch (err) {
        toast.error('Error al cargar la sucursal');
      } finally {
        setLoading(false);
      }
    };

    fetchSucursal();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/sucursales/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          horaApertura: new Date(`1970-01-01T${form.horaApertura}:00`),
          horaCierre: new Date(`1970-01-01T${form.horaCierre}:00`),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success('Sucursal actualizada correctamente');
      router.push('/main/sucursales');
    } catch {
      toast.error('No se pudo actualizar la sucursal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Editar sucursal</h2>
        <p className="text-muted-foreground">Modifica los campos necesarios</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['nombre', 'direccion', 'ciudad', 'telefono', 'emailContacto'].map(field => (
          <div key={field} className="space-y-1">
            <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
            <Input
              id={field}
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              required
            />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="horaApertura">Hora de apertura</Label>
            <Input
              type="time"
              id="horaApertura"
              name="horaApertura"
              value={form.horaApertura}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="horaCierre">Hora de cierre</Label>
            <Input
              type="time"
              id="horaCierre"
              name="horaCierre"
              value={form.horaCierre}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Actualizar sucursal'}
        </Button>
      </form>
    </div>
  );
}
