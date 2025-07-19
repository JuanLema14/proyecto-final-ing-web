-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('RECIBIDO', 'EN_PREPARACION', 'LISTO_PARA_ENTREGAR', 'EN_CAMINO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "TipoPedido" AS ENUM ('EN_LOCAL', 'A_DOMICILIO', 'PARA_RECOGER');

-- CreateEnum
CREATE TYPE "EstadoMesa" AS ENUM ('DISPONIBLE', 'OCUPADA', 'RESERVADA', 'INACTIVA');

-- CreateEnum
CREATE TYPE "EstadoReserva" AS ENUM ('CONFIRMADA', 'PENDIENTE', 'CANCELADA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "EstadoEntrega" AS ENUM ('PENDIENTE', 'ASIGNADO', 'EN_RUTA', 'ENTREGADO', 'FALLIDO');

-- CreateEnum
CREATE TYPE "TipoMetodoPago" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'COMPLETADO', 'FALLIDO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "TipoTokenVerificacion" AS ENUM ('VERIFICACION_EMAIL', 'RESETEO_CONTRASENA');

-- CreateTable
CREATE TABLE "sucursales" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email_contacto" TEXT NOT NULL,
    "hora_apertura" TIME NOT NULL,
    "hora_cierre" TIME NOT NULL,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre_rol" TEXT NOT NULL,
    "descripcion" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "id_sucursal" INTEGER,
    "nombre" TEXT,
    "apellido" TEXT,
    "email" TEXT NOT NULL,
    "hash_contrasena" TEXT,
    "telefono" TEXT,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,
    "email_verificado" TIMESTAMP(3),
    "ultimo_acceso" TIMESTAMP(3),
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "id_usuario" INTEGER NOT NULL,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("id_usuario","id_rol")
);

-- CreateTable
CREATE TABLE "categorias_menu" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categorias_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_menu" (
    "id" SERIAL NOT NULL,
    "id_categoria" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(10,2) NOT NULL,
    "url_imagen" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "items_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sucursal_items_menu" (
    "id_sucursal" INTEGER NOT NULL,
    "id_item_menu" INTEGER NOT NULL,

    CONSTRAINT "sucursal_items_menu_pkey" PRIMARY KEY ("id_sucursal","id_item_menu")
);

-- CreateTable
CREATE TABLE "ingredientes" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad_medida" TEXT NOT NULL,

    CONSTRAINT "ingredientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventario_sucursal" (
    "id_sucursal" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "stock_actual" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "stock_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "ultima_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventario_sucursal_pkey" PRIMARY KEY ("id_sucursal","id_ingrediente")
);

-- CreateTable
CREATE TABLE "recetas" (
    "id_item_menu" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "cantidad_requerida" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "recetas_pkey" PRIMARY KEY ("id_item_menu","id_ingrediente")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'RECIBIDO',
    "tipo" "TipoPedido" NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL,
    "total_pedido" DECIMAL(10,2) NOT NULL,
    "notas_cliente" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_item_menu" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal_item" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_metodo_pago" INTEGER NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "id_transaccion_gateway" TEXT,
    "datos_gateway" JSONB,
    "fecha_pago" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metodos_pago" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "TipoMetodoPago" NOT NULL,
    "proveedor_gateway" TEXT,
    "esta_activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recibos" (
    "id" SERIAL NOT NULL,
    "id_pago" INTEGER NOT NULL,
    "codigo_recibo" TEXT NOT NULL,
    "url_pdf" TEXT NOT NULL,
    "detalles_fiscales" JSONB NOT NULL,
    "fecha_emision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recibos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entregas" (
    "id" SERIAL NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_repartidor" INTEGER NOT NULL,
    "direccion_entrega" TEXT NOT NULL,
    "estado" "EstadoEntrega" NOT NULL DEFAULT 'PENDIENTE',
    "hora_salida" TIMESTAMP(3),
    "hora_entrega_estimada" TIMESTAMP(3),
    "hora_entrega_real" TIMESTAMP(3),

    CONSTRAINT "entregas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promociones" (
    "id" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "porcentaje_descuento" DECIMAL(5,2),
    "monto_descuento" DECIMAL(10,2),
    "fecha_inicio" TIMESTAMP(3) NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,
    "esta_activa" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_promociones" (
    "id_pedido" INTEGER NOT NULL,
    "id_promocion" INTEGER NOT NULL,
    "monto_descontado" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "pedido_promociones_pkey" PRIMARY KEY ("id_pedido","id_promocion")
);

-- CreateTable
CREATE TABLE "mesas" (
    "id" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "numero_mesa" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "ubicacion_descripcion" TEXT,
    "estado" "EstadoMesa" NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "mesas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" SERIAL NOT NULL,
    "id_cliente" INTEGER NOT NULL,
    "id_mesa" INTEGER NOT NULL,
    "fecha_hora_reserva" TIMESTAMP(3) NOT NULL,
    "numero_personas" INTEGER NOT NULL,
    "estado" "EstadoReserva" NOT NULL DEFAULT 'PENDIENTE',
    "notas_cliente" TEXT,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones_items" (
    "id" BIGSERIAL NOT NULL,
    "id_item_pedido" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "puntuacion" INTEGER NOT NULL,
    "comentario" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "calificaciones_sucursales" (
    "id" BIGSERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "puntuacion_servicio" INTEGER NOT NULL,
    "puntuacion_ambiente" INTEGER NOT NULL,
    "puntuacion_comida" INTEGER NOT NULL,
    "comentario_general" TEXT,
    "visible_publicamente" BOOLEAN NOT NULL DEFAULT true,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "calificaciones_sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sesiones" (
    "id" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "hash_refresh_token" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "client_ip" TEXT NOT NULL,
    "esta_bloqueada" BOOLEAN NOT NULL DEFAULT false,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sesiones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_verificacion" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "hash_token" TEXT NOT NULL,
    "tipo" "TipoTokenVerificacion" NOT NULL,
    "expira_en" TIMESTAMP(3) NOT NULL,
    "usado_en" TIMESTAMP(3),

    CONSTRAINT "tokens_verificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_rol_key" ON "roles"("nombre_rol");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_menu_nombre_key" ON "categorias_menu"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "ingredientes_nombre_key" ON "ingredientes"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "metodos_pago_nombre_key" ON "metodos_pago"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "recibos_id_pago_key" ON "recibos"("id_pago");

-- CreateIndex
CREATE UNIQUE INDEX "recibos_codigo_recibo_key" ON "recibos"("codigo_recibo");

-- CreateIndex
CREATE UNIQUE INDEX "entregas_id_pedido_key" ON "entregas"("id_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "promociones_codigo_key" ON "promociones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "calificaciones_items_id_item_pedido_key" ON "calificaciones_items"("id_item_pedido");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_verificacion_hash_token_key" ON "tokens_verificacion"("hash_token");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_menu" ADD CONSTRAINT "items_menu_id_categoria_fkey" FOREIGN KEY ("id_categoria") REFERENCES "categorias_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sucursal_items_menu" ADD CONSTRAINT "sucursal_items_menu_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sucursal_items_menu" ADD CONSTRAINT "sucursal_items_menu_id_item_menu_fkey" FOREIGN KEY ("id_item_menu") REFERENCES "items_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_sucursal" ADD CONSTRAINT "inventario_sucursal_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventario_sucursal" ADD CONSTRAINT "inventario_sucursal_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "ingredientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_id_item_menu_fkey" FOREIGN KEY ("id_item_menu") REFERENCES "items_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recetas" ADD CONSTRAINT "recetas_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "ingredientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_id_item_menu_fkey" FOREIGN KEY ("id_item_menu") REFERENCES "items_menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_id_metodo_pago_fkey" FOREIGN KEY ("id_metodo_pago") REFERENCES "metodos_pago"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recibos" ADD CONSTRAINT "recibos_id_pago_fkey" FOREIGN KEY ("id_pago") REFERENCES "pagos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entregas" ADD CONSTRAINT "entregas_id_repartidor_fkey" FOREIGN KEY ("id_repartidor") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_promociones" ADD CONSTRAINT "pedido_promociones_id_pedido_fkey" FOREIGN KEY ("id_pedido") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_promociones" ADD CONSTRAINT "pedido_promociones_id_promocion_fkey" FOREIGN KEY ("id_promocion") REFERENCES "promociones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesas" ADD CONSTRAINT "mesas_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_cliente_fkey" FOREIGN KEY ("id_cliente") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_id_mesa_fkey" FOREIGN KEY ("id_mesa") REFERENCES "mesas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_items" ADD CONSTRAINT "calificaciones_items_id_item_pedido_fkey" FOREIGN KEY ("id_item_pedido") REFERENCES "items_pedido"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_items" ADD CONSTRAINT "calificaciones_items_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_sucursales" ADD CONSTRAINT "calificaciones_sucursales_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "calificaciones_sucursales" ADD CONSTRAINT "calificaciones_sucursales_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesiones" ADD CONSTRAINT "sesiones_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_verificacion" ADD CONSTRAINT "tokens_verificacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
