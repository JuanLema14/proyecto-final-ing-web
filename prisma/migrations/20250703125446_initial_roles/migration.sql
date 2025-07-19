-- Insertar los roles iniciales en la tabla "roles"
INSERT INTO roles (nombre_rol, descripcion) VALUES
('Administrador General', 'Acceso completo a todas las funcionalidades del sistema.'),
('Gerente', 'Gestión completa de la sucursal a la que está asignado.'),
('Chef', 'Puede ver los pedidos que llegan a la cocina y gestionar el inventario.'),
('Mesero', 'Puede gestionar las mesas y los pedidos realizados en el local.'),
('Repartidor', 'Puede ver las entregas que le han sido asignadas.'),
('Cliente', 'Puede ver el menú del restaurante y realizar pedidos.'),
('Usuario', 'Rol genérico con acceso a transacciones y maestros.');