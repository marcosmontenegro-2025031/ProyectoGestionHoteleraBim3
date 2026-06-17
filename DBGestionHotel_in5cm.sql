create database dbgestionhotel_in5cm;
use dbgestionhotel_in5cm;

create table Empleado (
	id_empleado int auto_increment primary key,
	nombre varchar(100) not null,
	apellido varchar(100) not null,
	cargo varchar(100) not null
);


create table Huesped (
	id_huesped int auto_increment primary key,
	nombre varchar(100) not null,
	apellido varchar(100) not null,
	dpi varchar(20) unique not null,
	telefono varchar(20),
	correo varchar(100) unique
);


create table Usuario (
	id_usuario int auto_increment primary key,
	nombre varchar(100) not null,
	apellido varchar(100) not null,
	correo varchar(100) unique not null,
	contrasena varchar(255) not null,
	rol enum('ADMIN','EMPLEADO','HUESPED') not null,
	empleado_id_empleado int,
	huesped_id_huesped int,
	foreign key (empleado_id_empleado) references Empleado(id_empleado) on delete cascade,
	foreign key (huesped_id_huesped) references Huesped(id_huesped) on delete cascade
);


create table TipoHabitacion (
	id_tipo_habitacion int auto_increment primary key,
	nombre varchar(100) not null,
	descripcion varchar(255)
);


create table Habitacion (
	id_habitacion int auto_increment primary key,
	numero varchar(20) unique not null,
	estado enum('DISPONIBLE', 'OCUPADA', 'EN MANTENIMIENTO') not null,
	precio decimal(10,2) not null,
	id_tipo_habitacion int not null,
	foreign key (id_tipo_habitacion)  references TipoHabitacion(id_tipo_habitacion) on delete cascade
);


create table Reserva (
	id_reserva int auto_increment primary key,
	fecha_entrada date not null,
	fecha_salida date not null,
	estado enum( 'PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'FINALIZADA') not null,
	id_huesped int not null,
	id_empleado int not null,
	foreign key (id_huesped) references Huesped(id_huesped) on delete cascade,
	foreign key (id_empleado) references Empleado(id_empleado) on delete cascade
);


create table DetalleReserva (
	id_detalle int auto_increment primary key,
	id_reserva int not null,
	id_habitacion int not null,
	foreign key (id_reserva) references Reserva(id_reserva) on delete cascade,
	foreign key (id_habitacion) references Habitacion(id_habitacion) on delete cascade
);


create table HistorialReserva (
	id_historia int auto_increment primary key,
	estado_anterior varchar(50) not null,
	estado_nuevo varchar(50) not null,
	fecha datetime not null,
	id_reserva int not null,
	foreign key (id_reserva) references Reserva(id_reserva) on delete cascade
);


create table Servicio (
	id_servicio int auto_increment primary key,
	nombre varchar(100) not null,
	precio decimal(10,2) not null
);


create table ConsumoServicio (
	id_consumo int auto_increment primary key,
	cantidad int not null,
	id_reserva int not null,
	id_servicio int not null,
	foreign key (id_reserva) references Reserva(id_reserva) on delete cascade,
	foreign key (id_servicio) references Servicio(id_servicio) on delete cascade
);


create table MetodoPago (
 id_metodo_pago int auto_increment primary key,
 tipo enum('EFECTIVO', 'TARJETA', 'TRANSFERENCIA') not null
);

create table Factura (
	id_factura int auto_increment primary key,
	numero_factura varchar(50) unique not null,
	total decimal(10,2) not null,
	fecha datetime not null,
	id_reserva int not null,
	id_metodo_pago int not null,
	foreign key (id_reserva)references Reserva(id_reserva) on delete cascade,
	foreign key (id_metodo_pago) references MetodoPago(id_metodo_pago) on delete cascade
);

-- PROCEDIMIENTOS ALMACENADOS

-- EMPLEADO
delimiter $$
create procedure sp_empleado_create(
	in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_cargo varchar(100)
)
begin
	insert into Empleado(nombre, apellido, cargo)
    values(p_nombre, p_apellido, p_cargo);
end$$
delimiter ;


delimiter $$
create procedure sp_empleados_read_all()
begin
	select * from Empleado;
end$$
delimiter ;

delimiter $$
create procedure sp_empleado_read_by_id(
	in p_id int
)
begin
	select * from Empleado
    where id_empleado = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_empleado_update(
	in p_id int,
    in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_cargo varchar(100)
)
begin
	update Empleado
    set nombre = p_nombre,
		apellido = p_apellido,
        cargo = p_cargo
	where id_empleado = p_id;
	select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_empleado_delete(
	in p_id int
)
begin
	delete from Empleado
    where id_empleado = p_id;
    
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Huesped
delimiter $$
create procedure sp_huesped_create(
	in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_dpi varchar(20),
    in p_telefono varchar(20),
    in p_correo varchar(100)
)
begin
	insert into Huesped(nombre, apellido, dpi, telefono, correo)
    values(p_nombre, p_apellido, p_dpi, p_telefono, p_correo);
end$$
delimiter ;


delimiter $$
create procedure sp_huespedes_read_all()
begin
	select * from Huesped;
end$$
delimiter ;


delimiter $$
create procedure sp_huesped_read_by_id(
	in p_id int
)
begin
	select * from Huesped
    where id_huesped = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_huesped_update(
	in p_id int,
    in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_dpi varchar(20),
    in p_telefono varchar(20),
    in p_correo varchar(100)
)
begin
	update Huesped
    set nombre = p_nombre,
		apellido = p_apellido,
        dpi = p_dpi,
        telefono = p_telefono,
        correo = p_correo
	where id_huesped = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_huesped_delete(
	in p_id int
)
begin
	delete from Huesped
    where id_huesped = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Usuario
delimiter $$
create procedure sp_usuario_create(
	in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_correo varchar(100),
    in p_contrasena varchar(255),
    in p_rol varchar(20),
    in p_empleado_id_empleado int,
    in p_huesped_id_huesped int
)
begin
	insert into Usuario(
		nombre,
        apellido,
        correo,
        contrasena,
        rol,
        empleado_id_empleado,
        huesped_id_huesped
    )
    values(
		p_nombre,
        p_apellido,
        p_correo,
        p_contrasena,
        p_rol,
        p_empleado_id_empleado,
        p_huesped_id_huesped
    );
end$$
delimiter ;


delimiter $$
create procedure sp_usuarios_read_all()
begin
	select * from Usuario;
end$$
delimiter ;


delimiter $$
create procedure sp_usuario_read_by_id(
	in p_id int
)
begin
	select * from Usuario
    where id_usuario = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_usuario_update(
	in p_id int,
    in p_nombre varchar(100),
    in p_apellido varchar(100),
    in p_correo varchar(100),
    in p_contrasena varchar(255),
    in p_rol varchar(20),
    in p_empleado_id_empleado int,
    in p_huesped_id_huesped int
)
begin
	update Usuario
    set nombre = p_nombre,
		apellido = p_apellido,
        correo = p_correo,
        contrasena = p_contrasena,
        rol = p_rol,
        empleado_id_empleado = p_empleado_id_empleado,
        huesped_id_huesped = p_huesped_id_huesped
	where id_usuario = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_usuario_delete(
	in p_id int
)
begin
	delete from Usuario
    where id_usuario = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Tipo de Habitacion
delimiter $$
create procedure sp_tipo_habitacion_create(
	in p_nombre varchar(100),
    in p_descripcion varchar(255)
)
begin
	insert into TipoHabitacion(nombre, descripcion)
    values(p_nombre, p_descripcion);
end$$
delimiter ;


delimiter $$
create procedure sp_tipo_habitaciones_read_all()
begin
	select * from TipoHabitacion;
end$$
delimiter ;


delimiter $$
create procedure sp_tipo_habitacion_read_by_id(
	in p_id int
)
begin
	select * from TipoHabitacion
    where id_tipo_habitacion = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_tipo_habitacion_update(
	in p_id int,
    in p_nombre varchar(100),
    in p_descripcion varchar(255)
)
begin
	update TipoHabitacion
    set nombre = p_nombre,
		descripcion = p_descripcion
	where id_tipo_habitacion = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_tipo_habitacion_delete(
	in p_id int
)
begin
	delete from TipoHabitacion
    where id_tipo_habitacion = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


-- Habitacion
delimiter $$
create procedure sp_habitacion_create(
	in p_numero varchar(20),
    in p_estado varchar(50),
    in p_precio decimal(10,2),
    in p_id_tipo_habitacion int
)
begin
	insert into Habitacion(
		numero,
        estado,
        precio,
        id_tipo_habitacion
    )
    values(
		p_numero,
        p_estado,
        p_precio,
        p_id_tipo_habitacion
    );
end$$
delimiter ;


delimiter $$
create procedure sp_habitaciones_read_all()
begin
	select * from Habitacion;
end$$
delimiter ;


delimiter $$
create procedure sp_habitacion_read_by_id(
	in p_id int
)
begin
	select * from Habitacion
    where id_habitacion = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_habitacion_update(
	in p_id int,
    in p_numero varchar(20),
    in p_estado varchar(50),
    in p_precio decimal(10,2),
    in p_id_tipo_habitacion int
)
begin
	update Habitacion
    set numero = p_numero,
		estado = p_estado,
        precio = p_precio,
        id_tipo_habitacion = p_id_tipo_habitacion
	where id_habitacion = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_habitacion_delete(
	in p_id int
)
begin
	delete from Habitacion
    where id_habitacion = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Reserva
delimiter $$
create procedure sp_reserva_create(
	in p_fecha_entrada date,
    in p_fecha_salida date,
    in p_estado varchar(50),
    in p_id_huesped int,
    in p_id_empleado int
)
begin
	insert into Reserva(
		fecha_entrada,
        fecha_salida,
        estado,
        id_huesped,
        id_empleado
    )
    values(
		p_fecha_entrada,
        p_fecha_salida,
        p_estado,
        p_id_huesped,
        p_id_empleado
    );
end$$
delimiter ;


delimiter $$
create procedure sp_reservas_read_all()
begin
	select * from Reserva;
end$$
delimiter ;


delimiter $$
create procedure sp_reserva_read_by_id(
	in p_id int
)
begin
	select * from Reserva
    where id_reserva = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_reserva_update(
	in p_id int,
    in p_fecha_entrada date,
    in p_fecha_salida date,
    in p_estado varchar(50),
    in p_id_huesped int,
    in p_id_empleado int
)
begin
	update Reserva
    set fecha_entrada = p_fecha_entrada,
		fecha_salida = p_fecha_salida,
        estado = p_estado,
        id_huesped = p_id_huesped,
        id_empleado = p_id_empleado
	where id_reserva = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_reserva_delete(
	in p_id int
)
begin
	delete from Reserva
    where id_reserva = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Detalle Reserva
delimiter $$
create procedure sp_detalle_reserva_create(
	in p_id_reserva int,
    in p_id_habitacion int
)
begin
	insert into Detalle_reserva(
		id_reserva,
        id_habitacion
    )
    values(
		p_id_reserva,
        p_id_habitacion
    );
end$$
delimiter ;


delimiter $$
create procedure sp_detalles_reserva_read_all()
begin
	select * from Detalle_reserva;
end$$
delimiter ;


delimiter $$
create procedure sp_detalle_reserva_read_by_id(
	in p_id int
)
begin
	select * from Detalle_reserva
    where id_detalle = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_detalle_reserva_update(
	in p_id int,
    in p_id_reserva int,
    in p_id_habitacion int
)
begin
	update Detalle_reserva
    set id_reserva = p_id_reserva,
		id_habitacion = p_id_habitacion
	where id_detalle = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

delimiter $$
create procedure sp_detalle_reserva_delete(
	in p_id int
)
begin
	delete from Detalle_reserva
    where id_detalle = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Historial de Reserva

delimiter $$
create procedure sp_historial_reserva_create(
	in p_estado_anterior varchar(50),
    in p_estado_nuevo varchar(50),
    in p_fecha datetime,
    in p_id_reserva int
)
begin
	insert into HistorialReserva(
		estado_anterior,
        estado_nuevo,
        fecha,
        id_reserva
    )
    values(
		p_estado_anterior,
        p_estado_nuevo,
        p_fecha,
        p_id_reserva
    );
end$$
delimiter ;


delimiter $$
create procedure sp_historial_reservas_read_all()
begin
	select * from HistorialReserva;
end$$
delimiter ;


delimiter $$
create procedure sp_historial_reserva_read_by_id(
	in p_id int
)
begin
	select * from HistorialReserva
    where id_historia = p_id;
end$$
delimiter ;

delimiter $$
create procedure sp_historial_reserva_update(
	in p_id int,
    in p_estado_anterior varchar(50),
    in p_estado_nuevo varchar(50),
    in p_fecha datetime,
    in p_id_reserva int
)
begin
	update HistorialReserva
    set estado_anterior = p_estado_anterior,
		estado_nuevo = p_estado_nuevo,
        fecha = p_fecha,
        id_reserva = p_id_reserva
	where id_historia = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_historial_reserva_delete(
	in p_id int
)
begin
	delete from HistorialReserva
    where id_historia = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Servicio
delimiter $$
create procedure sp_servicio_create(
	in p_nombre varchar(100),
    in p_precio decimal(10,2)
)
begin
	insert into Servicio(
		nombre,
        precio
    )
    values(
		p_nombre,
        p_precio
    );
end$$
delimiter ;


delimiter $$
create procedure sp_servicios_read_all()
begin
	select * from Servicio;
end$$
delimiter ;


delimiter $$
create procedure sp_servicio_read_by_id(
	in p_id int
)
begin
	select * from Servicio
    where id_servicio = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_servicio_update(
	in p_id int,
    in p_nombre varchar(100),
    in p_precio decimal(10,2)
)
begin
	update Servicio
    set nombre = p_nombre,
		precio = p_precio
	where id_servicio = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_servicio_delete(
	in p_id int
)
begin
	delete from Servicio
    where id_servicio = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Consumo de Servicio
delimiter $$
create procedure sp_consumo_servicio_create(
	in p_cantidad int,
    in p_id_reserva int,
    in p_id_servicio int
)
begin
	insert into ConsumoServicio(
		cantidad,
        id_reserva,
        id_servicio
    )
    values(
		p_cantidad,
        p_id_reserva,
        p_id_servicio
    );
end$$
delimiter ;


delimiter $$
create procedure sp_consumos_servicio_read_all()
begin
	select * from ConsumoServicio;
end$$
delimiter ;


delimiter $$
create procedure sp_consumo_servicio_read_by_id(
	in p_id int
)
begin
	select * from ConsumoServicio
    where id_consumo = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_consumo_servicio_update(
	in p_id int,
    in p_cantidad int,
    in p_id_reserva int,
    in p_id_servicio int
)
begin
	update ConsumoServicio
    set cantidad = p_cantidad,
		id_reserva = p_id_reserva,
        id_servicio = p_id_servicio
	where id_consumo = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_consumo_servicio_delete(
	in p_id int
)
begin
	delete from ConsumoServicio
    where id_consumo = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Metodo de Pago
delimiter $$
create procedure sp_metodo_pago_create(
	in p_tipo varchar(50)
)
begin
	insert into MetodoPago(
		tipo
    )
    values(
		p_tipo
    );
end$$
delimiter ;


delimiter $$
create procedure sp_metodos_pago_read_all()
begin
	select * from MetodoPago;
end$$
delimiter ;


delimiter $$
create procedure sp_metodo_pago_read_by_id(
	in p_id int
)
begin
	select * from MetodoPago
    where id_metodo_pago = p_id;
end$$
delimiter ;


delimiter $$
create procedure sp_metodo_pago_update(
	in p_id int,
    in p_tipo varchar(50)
)
begin
	update MetodoPago
    set tipo = p_tipo
	where id_metodo_pago = p_id;
    
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_metodo_pago_delete(
	in p_id int
)
begin
	delete from MetodoPago
    where id_metodo_pago = p_id;
    
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- Factura

delimiter $$
create procedure sp_factura_create(
	in p_numero_factura varchar(50),
    in p_total decimal(10,2),
    in p_fecha datetime,
    in p_id_reserva int,
    in p_id_metodo_pago int
)
begin
	insert into Factura(
		numero_factura,
        total,
        fecha,
        id_reserva,
        id_metodo_pago
    )
    values(
		p_numero_factura,
        p_total,
        p_fecha,
        p_id_reserva,
        p_id_metodo_pago
    );
end$$
delimiter ;


delimiter $$
create procedure sp_facturas_read_all()
begin
	select * from Factura;
end$$
delimiter ;


delimiter $$
create procedure sp_factura_read_by_id(
	in p_id int
)
begin
	select * from Factura
    where id_factura = p_id;
end$$
delimiter ;


delimiter $$

create procedure sp_factura_update(
	in p_id int,
    in p_numero_factura varchar(50),
    in p_total decimal(10,2),
    in p_fecha datetime,
    in p_id_reserva int,
    in p_id_metodo_pago int
)
begin
	update Factura
    set numero_factura = p_numero_factura,
		total = p_total,
        fecha = p_fecha,
        id_reserva = p_id_reserva,
        id_metodo_pago = p_id_metodo_pago
	where id_factura = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;


delimiter $$
create procedure sp_factura_delete(
	in p_id int
)
begin
	delete from Factura
    where id_factura = p_id;
    select row_count() as filas_afectadas;
end$$
delimiter ;

-- REGISTROS

-- Empleado
call sp_empleado_create('Juan','Perez','Administrador');
call sp_empleado_create('Maria','Lopez','Recepcionista');
call sp_empleado_create('Carlos','Ramirez','Limpieza');
call sp_empleado_create('Ana','Gomez','Gerente');
call sp_empleado_create('Pedro','Hernandez','Seguridad');
call sp_empleado_create('Luis','Martinez','Cocinero');
call sp_empleado_create('Sofia','Garcia','Recepcionista');
call sp_empleado_create('Miguel','Torres','Supervisor');
call sp_empleado_create('Laura','Diaz','Contadora');
call sp_empleado_create('Jose','Castillo','Mantenimiento');

-- Huesped
call sp_huesped_create('Luis','Martinez','1234567890101','55511111','luis@gmail.com');
call sp_huesped_create('Sofia','Garcia','1234567890102','55522222','sofia@gmail.com');
call sp_huesped_create('Pedro','Lopez','1234567890103','55533333','pedro@gmail.com');
call sp_huesped_create('Laura','Diaz','1234567890104','55544444','laura@gmail.com');
call sp_huesped_create('Miguel','Torres','1234567890105','55555555','miguel@gmail.com');
call sp_huesped_create('Carlos','Mendez','1234567890106','55566666','carlos@gmail.com');
call sp_huesped_create('Ana','Castillo','1234567890107','55577777','ana@gmail.com');
call sp_huesped_create('Jose','Morales','1234567890108','55588888','jose@gmail.com');
call sp_huesped_create('Maria','Ruiz','1234567890109','55599999','maria@gmail.com');
call sp_huesped_create('Daniel','Perez','1234567890110','55500000','daniel@gmail.com');

-- Usuario
call sp_usuario_create('Admin','Hotel','admin@gmail.com','12345','ADMIN',1,NULL);
call sp_usuario_create('Juan','Perez','juan@gmail.com','12345','EMPLEADO',2,NULL);
call sp_usuario_create('Maria','Lopez','maria@gmail.com','12345','EMPLEADO',3,NULL);
call sp_usuario_create('Luis','Martinez','luis@gmail.com','12345','HUESPED',NULL,1);
call sp_usuario_create('Sofia','Garcia','sofia@gmail.com','12345','HUESPED',NULL,2);
call sp_usuario_create('Pedro','Lopez','pedro@gmail.com','12345','HUESPED',NULL,3);
call sp_usuario_create('Laura','Diaz','laura@gmail.com','12345','HUESPED',NULL,4);
call sp_usuario_create('Miguel','Torres','miguel@gmail.com','12345','HUESPED',NULL,5);
call sp_usuario_create('Carlos','Mendez','carlos@gmail.com','12345','EMPLEADO',4,NULL);
call sp_usuario_create('Ana','Castillo','ana@gmail.com','12345','EMPLEADO',5,NULL);

-- Tipo de Habitacion
call sp_tipo_habitacion_create('Individual','Habitacion para una persona');
call sp_tipo_habitacion_create('Doble','Habitacion con dos camas');
call sp_tipo_habitacion_create('Suite','Habitacion de lujo');
call sp_tipo_habitacion_create('Familiar','Habitacion familiar');
call sp_tipo_habitacion_create('VIP','Habitacion exclusiva');
call sp_tipo_habitacion_create('Presidencial','Habitacion presidencial');
call sp_tipo_habitacion_create('Economica','Habitacion sencilla');
call sp_tipo_habitacion_create('Deluxe','Habitacion deluxe');
call sp_tipo_habitacion_create('Ejecutiva','Habitacion ejecutiva');
call sp_tipo_habitacion_create('Premium','Habitacion premium');

-- Habitacion
call sp_habitacion_create('101','DISPONIBLE',250,1);
call sp_habitacion_create('102','DISPONIBLE',300,2);
call sp_habitacion_create('103','OCUPADA',500,3);
call sp_habitacion_create('104','DISPONIBLE',400,4);
call sp_habitacion_create('105','EN MANTENIMIENTO',600,5);
call sp_habitacion_create('106','DISPONIBLE',350,6);
call sp_habitacion_create('107','DISPONIBLE',200,7);
call sp_habitacion_create('108','OCUPADA',450,8);
call sp_habitacion_create('109','DISPONIBLE',550,9);
call sp_habitacion_create('110','DISPONIBLE',700,10);

-- Reserva
call sp_reserva_create('2026-06-20','2026-06-25','PENDIENTE',1,1);
call sp_reserva_create('2026-07-01','2026-07-05','CONFIRMADA',2,2);
call sp_reserva_create('2026-07-10','2026-07-15','PENDIENTE',3,3);
call sp_reserva_create('2026-08-01','2026-08-04','CONFIRMADA',4,4);
call sp_reserva_create('2026-09-01','2026-09-10','FINALIZADA',5,5);
call sp_reserva_create('2026-10-01','2026-10-05','PENDIENTE',6,1);
call sp_reserva_create('2026-11-01','2026-11-07','CONFIRMADA',7,2);
call sp_reserva_create('2026-12-01','2026-12-05','PENDIENTE',8,3);
call sp_reserva_create('2026-12-10','2026-12-15','CONFIRMADA',9,4);
call sp_reserva_create('2026-12-20','2026-12-25','FINALIZADA',10,5);

-- Detalle de Reserva
call sp_detalle_reserva_create(1,1);
call sp_detalle_reserva_create(2,2);
call sp_detalle_reserva_create(3,3);
call sp_detalle_reserva_create(4,4);
call sp_detalle_reserva_create(5,5);
call sp_detalle_reserva_create(6,6);
call sp_detalle_reserva_create(7,7);
call sp_detalle_reserva_create(8,8);
call sp_detalle_reserva_create(9,9);
call sp_detalle_reserva_create(10,10);

-- Historial de Reserva
call sp_historial_reserva_create('PENDIENTE','CONFIRMADA',NOW(),1);
call sp_historial_reserva_create('PENDIENTE','CONFIRMADA',NOW(),2);
call sp_historial_reserva_create('PENDIENTE','CANCELADA',NOW(),3);
call sp_historial_reserva_create('PENDIENTE','CONFIRMADA',NOW(),4);
call sp_historial_reserva_create('CONFIRMADA','FINALIZADA',NOW(),5);
call sp_historial_reserva_create('PENDIENTE','CONFIRMADA',NOW(),6);
call sp_historial_reserva_create('PENDIENTE','CANCELADA',NOW(),7);
call sp_historial_reserva_create('CONFIRMADA','FINALIZADA',NOW(),8);
call sp_historial_reserva_create('PENDIENTE','CONFIRMADA',NOW(),9);
call sp_historial_reserva_create('CONFIRMADA','FINALIZADA',NOW(),10);

-- Servicio

call sp_servicio_create('Desayuno',50);
call sp_servicio_create('Almuerzo',100);
call sp_servicio_create('Cena',120);
call sp_servicio_create('Lavanderia',75);
call sp_servicio_create('Spa',200);
call sp_servicio_create('Transporte',150);
call sp_servicio_create('Masaje',180);
call sp_servicio_create('Bar',90);
call sp_servicio_create('Gimnasio',60);
call sp_servicio_create('Room Service',130);

-- Consumo de Servicio
call sp_consumo_servicio_create(2,1,1);
call sp_consumo_servicio_create(1,2,2);
call sp_consumo_servicio_create(3,3,3);
call sp_consumo_servicio_create(1,4,4);
call sp_consumo_servicio_create(2,5,5);
call sp_consumo_servicio_create(1,6,6);
call sp_consumo_servicio_create(2,7,7);
call sp_consumo_servicio_create(4,8,8);
call sp_consumo_servicio_create(1,9,9);
call sp_consumo_servicio_create(3,10,10);

-- Metodo de Pago
call sp_metodo_pago_create('EFECTIVO');
call sp_metodo_pago_create('TARJETA');
call sp_metodo_pago_create('TRANSFERENCIA');
call sp_metodo_pago_create('EFECTIVO');
call sp_metodo_pago_create('TARJETA');
call sp_metodo_pago_create('TRANSFERENCIA');
call sp_metodo_pago_create('EFECTIVO');
call sp_metodo_pago_create('TARJETA');
call sp_metodo_pago_create('TRANSFERENCIA');
call sp_metodo_pago_create('EFECTIVO');

-- Factura
call sp_factura_create('FAC001',500,NOW(),1,1);
call sp_factura_create('FAC002',800,NOW(),2,2);
call sp_factura_create('FAC003',900,NOW(),3,3);
call sp_factura_create('FAC004',1200,NOW(),4,1);
call sp_factura_create('FAC005',1500,NOW(),5,2);
call sp_factura_create('FAC006',700,NOW(),6,3);
call sp_factura_create('FAC007',950,NOW(),7,1);
call sp_factura_create('FAC008',1100,NOW(),8,2);
call sp_factura_create('FAC009',1300,NOW(),9,3);
call sp_factura_create('FAC010',1600,NOW(),10,1);