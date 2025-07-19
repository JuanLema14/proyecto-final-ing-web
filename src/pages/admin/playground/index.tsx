// /src/pages/admin/playground/index.tsx
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ApiPlaygroundPage() {
  const { data: session } = useSession();
  const [response, setResponse] = useState<any>(null);

  // Estados para Sucursales
  const [sucursalId, setSucursalId] = useState('');
  const [sucursalData, setSucursalData] = useState({ nombre: 'Sucursal de Prueba', ciudad: 'Medellín' });

  // Estados para Ingredientes
  const [ingredienteData, setIngredienteData] = useState({ nombre: 'Tomates', unidadMedida: 'Kg' });

  // Estados para Inventario
  const [inventarioSucursalId, setInventarioSucursalId] = useState('');
  const [movimientoData, setMovimientoData] = useState({
    idSucursal: '',
    idIngrediente: '',
    cantidad: '10',
    tipoMovimiento: 'ENTRADA',
  });

  // Graficar ingredientes y sucursales
  const [graficaIngredienteId, setGraficaIngredienteId] = useState('');
  const [graficaSucursalId, setGraficaSucursalId] = useState('');

  const [categoriaId, setCategoriaId] = useState('');
  const [categoriaData, setCategoriaData] = useState({
    nombre: 'Platos Fuertes',
    descripcion: 'Los platos principales de la casa',
  });

  const handleApiCall = async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    body?: any
  ) => {
    setResponse('Cargando...');
    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (res.status === 204) {
        setResponse({ status: 204, message: 'Recurso eliminado exitosamente.' });
        return;
      }

      const data = await res.json();
      setResponse({ status: res.status, data });
    } catch (error) {
      setResponse({ error: 'Falló la petición de fetch.' });
    }
  };

  if (!session) {
    return <p className="p-4">Por favor, inicia sesión para usar el playground.</p>;
  }

  return (
    <div className="container mx-auto p-4 flex flex-col gap-8">
      <h1 className="text-3xl font-bold">API Playground</h1>

      {/* --- SECCIÓN DE SUCURSALES --- */}
      <Card>
        <CardHeader><CardTitle>/api/sucursales</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleApiCall('GET', '/api/sucursales')}>GET</Button>
            <span>Obtener todas las sucursales.</span>
          </div>
          <div className="flex flex-col gap-2 p-4 border rounded-md">
            <h3 className="font-semibold">POST /api/sucursales</h3>
            <Input placeholder="Nombre" value={sucursalData.nombre} onChange={(e) => setSucursalData({ ...sucursalData, nombre: e.target.value })} />
            <Input placeholder="Ciudad" value={sucursalData.ciudad} onChange={(e) => setSucursalData({ ...sucursalData, ciudad: e.target.value })} />
            <Button
              onClick={() =>
                handleApiCall('POST', '/api/sucursales', {
                  ...sucursalData,
                  direccion: 'Dirección de Prueba',
                  telefono: '1234567',
                  emailContacto: 'test@test.com',
                  horaApertura: new Date('1970-01-01T10:00:00').toISOString(),
                  horaCierre: new Date('1970-01-01T22:00:00').toISOString(),
                })
              }
            >
              Crear Sucursal
            </Button>
            <p className="text-xs text-muted-foreground">Solo para Admins.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={() => handleApiCall('DELETE', `/api/sucursales/${sucursalId}`)}
              disabled={!sucursalId}
            >
              DELETE
            </Button>
            <Input
              className="w-20"
              placeholder="ID"
              value={sucursalId}
              onChange={(e) => setSucursalId(e.target.value)}
            />
            <span>Eliminar una sucursal por ID (solo para Admins).</span>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* --- SECCIÓN DE INGREDIENTES E INVENTARIO --- */}
      <Card>
        <CardHeader><CardTitle>/api/ingredientes y /api/inventario</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-6">
          {/* GET Ingredientes */}
          <div className="flex items-center gap-2">
            <Button onClick={() => handleApiCall('GET', '/api/ingredientes')}>GET Ingredientes</Button>
            <span>Obtener todos los ingredientes.</span>
          </div>
          {/* POST Ingrediente */}
          <div className="flex flex-col gap-2 p-4 border rounded-md">
            <h3 className="font-semibold">POST /api/ingredientes</h3>
            <Input placeholder="Nombre del ingrediente" value={ingredienteData.nombre} onChange={(e) => setIngredienteData({ ...ingredienteData, nombre: e.target.value })} />
            <Input placeholder="Unidad de Medida (Kg, Lt, Un)" value={ingredienteData.unidadMedida} onChange={(e) => setIngredienteData({ ...ingredienteData, unidadMedida: e.target.value })} />
            <Button onClick={() => handleApiCall('POST', '/api/ingredientes', ingredienteData)}>Crear Ingrediente</Button>
            <p className="text-xs text-muted-foreground">Solo para Admins.</p>
          </div>
          
          <Separator />
          
          {/* GET Inventario por Sucursal */}
          <div className="flex items-center gap-2">
            <Button onClick={() => handleApiCall('GET', `/api/inventario/${inventarioSucursalId}`)} disabled={!inventarioSucursalId}>GET Inventario</Button>
            <Input className="w-20" placeholder="Sucursal ID" value={inventarioSucursalId} onChange={(e) => setInventarioSucursalId(e.target.value)} />
            <span>Obtener inventario de una sucursal específica.</span>
          </div>

          {/* POST Movimiento de Inventario */}
          <div className="flex flex-col gap-4 p-4 border rounded-md">
            <h3 className="font-semibold">POST /api/movimientos-inventario</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mov-sucursal">ID Sucursal</Label>
                <Input id="mov-sucursal" placeholder="ID Sucursal" value={movimientoData.idSucursal} onChange={(e) => setMovimientoData({ ...movimientoData, idSucursal: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="mov-ingrediente">ID Ingrediente</Label>
                <Input id="mov-ingrediente" placeholder="ID Ingrediente" value={movimientoData.idIngrediente} onChange={(e) => setMovimientoData({ ...movimientoData, idIngrediente: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="mov-cantidad">Cantidad</Label>
                <Input id="mov-cantidad" type="number" placeholder="Cantidad" value={movimientoData.cantidad} onChange={(e) => setMovimientoData({ ...movimientoData, cantidad: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="mov-tipo">Tipo de Movimiento</Label>
                <Select value={movimientoData.tipoMovimiento} onValueChange={(value) => setMovimientoData({ ...movimientoData, tipoMovimiento: value })}>
                  <SelectTrigger id="mov-tipo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ENTRADA">Entrada</SelectItem>
                    <SelectItem value="SALIDA">Salida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={() => handleApiCall('POST', '/api/movimientos-inventario', movimientoData)}>Ejecutar Movimiento</Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Gráfica de Inventario */}
      <div className="flex flex-col gap-2 p-4 border rounded-md">
        <h3 className="font-semibold">GET /api/inventario/grafica/[ingredienteId]</h3>
        <p className="text-sm text-muted-foreground">
          Obtiene el historial de movimientos de un ingrediente para generar una gráfica.
        </p>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              const url = `/api/inventario/grafica/${graficaIngredienteId}${graficaSucursalId ? `?sucursalId=${graficaSucursalId}` : ''}`;
              handleApiCall('GET', url);
            }}
            disabled={!graficaIngredienteId}
          >
            Obtener Datos de Gráfica
          </Button>
          <Input
            className="w-32"
            placeholder="ID Ingrediente"
            value={graficaIngredienteId}
            onChange={(e) => setGraficaIngredienteId(e.target.value)}
          />
          <Input
            className="w-32"
            placeholder="ID Sucursal (opcional)"
            value={graficaSucursalId}
            onChange={(e) => setGraficaSucursalId(e.target.value)}
          />
        </div>
      </div>

      <Separator />

      {/* --- SECCIÓN DE CATEGORÍAS DEL MENÚ --- */}
      <Card>
        <CardHeader><CardTitle>/api/categorias-menu</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Button onClick={() => handleApiCall('GET', '/api/categorias-menu')}>GET</Button>
            <span>Obtener todas las categorías.</span>
          </div>
          
          <div className="flex flex-col gap-2 p-4 border rounded-md">
            <h3 className="font-semibold">POST /api/categorias-menu</h3>
            <Input placeholder="Nombre" value={categoriaData.nombre} onChange={(e) => setCategoriaData({ ...categoriaData, nombre: e.target.value })} />
            <Input placeholder="Descripción" value={categoriaData.descripcion} onChange={(e) => setCategoriaData({ ...categoriaData, descripcion: e.target.value })} />
            <Button onClick={() => handleApiCall('POST', '/api/categorias-menu', categoriaData)}>
              Crear Categoría
            </Button>
            <p className="text-xs text-muted-foreground">Solo para Admins/Gerentes.</p>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={() => handleApiCall('PUT', `/api/categorias-menu/${categoriaId}`, { nombre: 'Nuevo Nombre' })} disabled={!categoriaId}>
              PUT
            </Button>
            <Button variant="destructive" onClick={() => handleApiCall('DELETE', `/api/categorias-menu/${categoriaId}`)} disabled={!categoriaId}>
              DELETE
            </Button>
            <Input className="w-20" placeholder="ID" value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} />
            <span>Actualizar o eliminar una categoría por ID.</span>
          </div>
        </CardContent>
      </Card>

      {/* --- SECCIÓN DE RESPUESTA --- */}
      <Card>
        <CardHeader><CardTitle>Respuesta de la API</CardTitle></CardHeader>
        <CardContent>
          <Textarea
            readOnly
            className="font-mono text-xs h-96"
            value={typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
          />
        </CardContent>
      </Card>
    </div>
  );
}