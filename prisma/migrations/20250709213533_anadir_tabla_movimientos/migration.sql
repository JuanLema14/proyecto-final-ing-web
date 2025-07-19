-- CreateTable
CREATE TABLE "movimientos" (
    "id" SERIAL NOT NULL,
    "id_sucursal" INTEGER NOT NULL,
    "id_ingrediente" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "cantidad" DECIMAL(10,2) NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_sucursal_fkey" FOREIGN KEY ("id_sucursal") REFERENCES "sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_ingrediente_fkey" FOREIGN KEY ("id_ingrediente") REFERENCES "ingredientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos" ADD CONSTRAINT "movimientos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
