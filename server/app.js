const express = require('express');
const path = require('path');
const config = require('./config.js');
const Database = require('better-sqlite3');
const app = express();
app.set('port', config.app.port);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));


// Conexión a la base de datos SQLite
let db;
try {
  db = new Database(path.join(__dirname, '..', 'db', 'veterimid.sqlite'), { readonly: false });
  console.log('Conectado a la base de datos SQLite.');
} catch (err) {
  console.error('Error al conectar a la base de datos:', err.message);
  process.exit(1);
}


/// USUARIOS
app.get('/usuarios', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM usuarios');
    const usuarios = stmt.all();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/usuarios/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE id_usuario = ?');
    const usuario = stmt.get(req.params.id);
    if (usuario) res.json(usuario);
    else res.status(404).json({ mensaje: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/usuarios_create', (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)');
    const info = stmt.run(nombre, correo, contraseña, rol);
    res.json({ message: 'Usuario creado', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/usuarios_update', (req, res) => {
  const { id_usuario, nombre, correo, contraseña, rol } = req.body;
  try {
    const stmt = db.prepare(`UPDATE usuarios SET nombre = ?, correo = ?, contraseña = ?, rol = ? WHERE id_usuario = ?`);
    const result = stmt.run(nombre, correo, contraseña, rol, id_usuario);
    if (result.changes > 0) res.redirect(req.get('Referer') || '/');
    else res.status(404).send('Usuario no encontrado o sin cambios');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/usuarios/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM usuarios WHERE id_usuario = ?');
    const result = stmt.run(req.params.id);
    if (result.changes > 0) res.json({ mensaje: 'Usuario eliminado correctamente' });
    else res.status(404).json({ mensaje: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
});
//--------------------------------------------------------------------

// Citas
app.get('/citas', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT
      c.id_cita,
      c.fecha,
      c.hora,
      c.id_mascota,
      c.id_veterinario,
      c.motivo,
      c.estado,
      m.nombre AS nombre_mascota,
      u.nombre AS veterinario_rol
      FROM citas c
      JOIN mascotas m ON c.id_mascota = m.id_mascota
      JOIN usuarios u ON c.id_veterinario = u.id_usuario;`);
    const citas = stmt.all(); // .all() para múltiples resultados
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/citas/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM citas WHERE id_cita = ?');
    const cita = stmt.get(req.params.id);
    cita ? res.json(cita) : res.status(404).json({ mensaje: 'Cita no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/cita_create', (req, res) => {
  const { fecha, hora, id_mascota, id_veterinario, motivo, estado } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO citas (fecha, hora, id_mascota, id_veterinario, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)`);
    const info = stmt.run(fecha, hora, id_mascota, id_veterinario, motivo, estado);
    res.json({ message: 'Cita registrada', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/citas_update', (req, res) => {
  const { id_cita, fecha, hora, id_mascota, id_veterinario, motivo, estado } = req.body;
  try {
    const stmt = db.prepare(`UPDATE citas SET fecha = ?, hora = ?, id_mascota = ?, id_veterinario = ?, motivo = ?, estado = ? WHERE id_cita = ?`);
    const result = stmt.run(fecha, hora, id_mascota, id_veterinario, motivo, estado, id_cita);
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Cita no encontrada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/citas/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM citas WHERE id_cita = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Cita eliminada' }) : res.status(404).json({ mensaje: 'Cita no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------------------------------------------

// Categorias
app.get('/categorias', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM categoria');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/categorias/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM categoria WHERE id_categoria = ?');
    const cat = stmt.get(req.params.id);
    cat ? res.json(cat) : res.status(404).json({ mensaje: 'Categoría no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/categoria_create', (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)');
    const info = stmt.run(nombre, descripcion);
    res.json({ message: 'Categoría creada', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/categoria_update', (req, res) => {
  const { id_categoria, nombre, descripcion } = req.body;
  try {
    const stmt = db.prepare(`UPDATE categoria SET nombre = ?, descripcion = ? WHERE id_categoria = ?`);
    const result = stmt.run(nombre, descripcion, id_categoria);
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Categoría no encontrada');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/categorias/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM categoria WHERE id_categoria = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Categoría eliminada' }) : res.status(404).json({ mensaje: 'Categoría no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// CLIENTES
// CLIENTES
app.get('/clientes', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clientes');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/clientes/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clientes WHERE id_cliente = ?');
    const cliente = stmt.get(req.params.id);
    cliente ? res.json(cliente) : res.status(404).json({ mensaje: 'Cliente no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/clientes_create', (req, res) => {
  const { nombre, telefono, correo, direccion } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO clientes (nombre, telefono, correo, direccion) VALUES (?, ?, ?, ?)');
    const info = stmt.run(nombre, telefono, correo, direccion);
    res.json({ message: 'Cliente registrado', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/clientes_update', (req, res) => {
  const { id_cliente, nombre, telefono, correo, direccion } = req.body;
  try {
    const stmt = db.prepare(`UPDATE clientes SET nombre = ?, telefono = ?, correo = ?, direccion = ? WHERE id_cliente = ?`);
    const result = stmt.run(nombre, telefono, correo, direccion, id_cliente);
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Cliente no encontrado o sin cambios');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/clientes/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM clientes WHERE id_cliente = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Cliente eliminado' }) : res.status(404).json({ mensaje: 'Cliente no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------------------------------------------

// HISTORIALES
app.get('/historiales', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT 
    h.id_historial,
    h.fecha,
    h.descripcion,
    h.tratamiento,
    h.id_mascota,
    m.nombre AS nombre_mascota
FROM historial_medico h
JOIN mascotas m ON h.id_mascota = m.id_mascota;
`);
    const historiales = stmt.all();
    res.json(historiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});app.get('/historiales/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM historial_medico WHERE id_historial = ?');
    const historial = stmt.get(req.params.id);
    historial ? res.json(historial) : res.status(404).json({ mensaje: 'Historial no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/historial_medico_create', (req, res) => {
  const { id_mascota, fecha, descripcion, tratamiento } = req.body;
  try {
    const stmt = db.prepare(`INSERT INTO historial_medico (id_mascota, fecha, descripcion, tratamiento) VALUES (?, ?, ?, ?)`);
    const info = stmt.run(id_mascota, fecha, descripcion, tratamiento);
    res.json({ message: 'Historial registrado', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/historial_medico_update', (req, res) => {
  const { id_historial, id_mascota, fecha, descripcion, tratamiento } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE historial_medico
      SET id_mascota = ?, fecha = ?, descripcion = ?, tratamiento = ?
      WHERE id_historial = ?
    `);
    const result = stmt.run(id_mascota, fecha, descripcion, tratamiento, id_historial);
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Historial no encontrado o sin cambios');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/historiales/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM historial_medico WHERE id_historial = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Historial eliminado' }) : res.status(404).json({ mensaje: 'Historial no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------------------------------------------

// INVENTARIO
app.get('/inventario', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT 
    i.id_inventario,
    i.categoria_id,
    i.nombre_producto,
    i.descripcion,
    i.cantidad,
    i.stock_minimo,
    i.precio_unitario,
    i.fecha_vencimiento,
    i.notas,
    i.fecha_registro,
    p.nombre AS nombre_proveedor,
    c.nombre AS nombre_categoria
FROM inventario i
JOIN proveedores p ON i.proveedor_id = p.id_proveedor
JOIN categoria c ON i.categoria_id = c.id_categoria;
`);
    const inventario = stmt.all();
    res.json(inventario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/inventario/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM inventario WHERE id_inventario = ?');
    const producto = stmt.get(req.params.id);
    producto ? res.json(producto) : res.status(404).json({ mensaje: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/inventario_create', (req, res) => {
  const {
    categoria_id, proveedor_id, nombre_producto, descripcion,
    cantidad, stock_minimo, precio_unitario, fecha_vencimiento,
    notas, fecha_registro
  } = req.body;

  try {
    const stmt = db.prepare(`
      INSERT INTO inventario (
        categoria_id, proveedor_id, nombre_producto, descripcion,
        cantidad, stock_minimo, precio_unitario, fecha_vencimiento,
        notas, fecha_registro
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      categoria_id, proveedor_id, nombre_producto, descripcion,
      cantidad, stock_minimo, precio_unitario, fecha_vencimiento,
      notas, fecha_registro
    );
    res.json({ message: 'Producto agregado', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/inventario_update', (req, res) => {
  const {
    id_inventario, categoria_id, proveedor_id, nombre_producto, descripcion,
    cantidad, stock_minimo, precio_unitario, fecha_vencimiento,
    notas, fecha_registro
  } = req.body;

  try {
    const stmt = db.prepare(`
      UPDATE inventario SET
        categoria_id = ?, proveedor_id = ?, nombre_producto = ?, descripcion = ?,
        cantidad = ?, stock_minimo = ?, precio_unitario = ?, fecha_vencimiento = ?,
        notas = ?, fecha_registro = ?
      WHERE id_inventario = ?
    `);
    const result = stmt.run(
      categoria_id, proveedor_id, nombre_producto, descripcion,
      cantidad, stock_minimo, precio_unitario, fecha_vencimiento,
      notas, fecha_registro, id_inventario
    );
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Inventario no encontrado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/inventario/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM inventario WHERE id_inventario = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Producto eliminado' }) : res.status(404).json({ mensaje: 'Producto no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------------------------------------------

// MASCOTAS
app.get('/mascotas', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT 
    m.id_mascota,
    m.nombre AS nombre_mascota,
    m.especie,
    m.raza,
    m.edad,
    m.peso,
    c.nombre AS nombre_cliente
FROM mascotas m
JOIN clientes c ON m.id_cliente = c.id_cliente;
`);
    const mascotas = stmt.all();
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una mascota por ID
app.get('/mascotas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('SELECT * FROM mascotas WHERE id_mascota = ?');
    const mascota = stmt.get(id);
    if (mascota) {
      res.json(mascota);
    } else {
      res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva mascota
app.post('/mascotas', (req, res) => {
  const { nombre, especie, raza, edad, peso, id_cliente } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO mascotas (nombre, especie, raza, edad, peso, id_cliente)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(nombre, especie, raza, edad, peso, id_cliente);
    res.json({ message: 'Mascota registrada', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar mascota existente
app.post('/mascotas_update', (req, res) => {
  const { id_mascota, nombre, especie, raza, edad, peso, id_cliente } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE mascotas
      SET nombre = ?, especie = ?, raza = ?, edad = ?, peso = ?, id_cliente = ?
      WHERE id_mascota = ?
    `);
    const result = stmt.run(nombre, especie, raza, edad, peso, id_cliente, id_mascota);
    if (result.changes > 0) {
      const referer = req.get('Referer');
      res.redirect(referer || '/mascotas');
    } else {
      res.status(404).send('Mascota no encontrada o sin cambios');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Eliminar mascota
app.delete('/mascotas/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM mascotas WHERE id_mascota = ?');
    const result = stmt.run(req.params.id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Mascota eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//------------------------------------------------------------

// PROVEEDORES// PROVEEDORES
app.get('/proveedores', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM proveedores');
    res.json(stmt.all());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/proveedores/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM proveedores WHERE id_proveedor = ?');
    const proveedor = stmt.get(req.params.id);
    proveedor ? res.json(proveedor) : res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/proveedores_create', (req, res) => {
  const { nombre, contacto, telefono, correo, direccion } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO proveedores (nombre, contacto, telefono, correo, direccion)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(nombre, contacto, telefono, correo, direccion);
    res.json({ message: 'Proveedor registrado', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/proveedores_update', (req, res) => {
  const { id_proveedor, nombre, contacto, telefono, correo, direccion } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE proveedores
      SET nombre = ?, contacto = ?, telefono = ?, correo = ?, direccion = ?
      WHERE id_proveedor = ?
    `);
    const result = stmt.run(nombre, contacto, telefono, correo, direccion, id_proveedor);
    result.changes > 0 ? res.redirect(req.get('Referer') || '/') : res.status(404).send('Proveedor no encontrado');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/proveedores/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM proveedores WHERE id_proveedor = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Proveedor eliminado' }) : res.status(404).json({ mensaje: 'Proveedor no encontrado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ---------------------------------------------------------------------

// VENTAS
app.get('/ventas', (req, res) => { 
  try {
    const stmt = db.prepare(`
      SELECT 
        f.id_factura,
        c.nombre AS cliente_nombre,
        i.nombre_producto,
        f.fecha,
        f.total
      FROM ventas f
      JOIN inventario i ON f.id_inventario = i.id_inventario
      JOIN clientes c ON f.id_cliente = c.id_cliente
      ORDER BY f.id_factura ASC
    `);
    const ventas = stmt.all();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/ventas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare(`SELECT * FROM ventas WHERE id_factura = ?`);
    const venta = stmt.get(id);
    if (venta) {
      res.json(venta);
    } else {
      res.status(404).json({ error: 'Venta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post('/ventas', (req, res) => {
  const { id_cliente, id_inventario, fecha, total } = req.body;
  try {
    const stmt = db.prepare(`
      INSERT INTO ventas (id_cliente, id_inventario, fecha, total)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(id_cliente, id_inventario, fecha, total);
    res.json({ message: 'Venta registrada', id: info.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post('/ventas_update', (req, res) => {
  const { id_factura, id_cliente, id_inventario, fecha, total } = req.body;
  try {
    const stmt = db.prepare(`
      UPDATE ventas
      SET id_cliente = ?, id_inventario = ?, fecha = ?, total = ?
      WHERE id_factura = ?
    `);
    const result = stmt.run(id_cliente, id_inventario, fecha, total, id_factura);
    if (result.changes > 0) {
      res.redirect(req.get('Referer'));
    } else {
      res.status(404).send('Venta no encontrada o sin cambios');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.delete('/ventas/:id', (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM ventas WHERE id_factura = ?');
    const result = stmt.run(req.params.id);
    result.changes > 0 ? res.json({ mensaje: 'Venta eliminada' }) : res.status(404).json({ mensaje: 'Venta no encontrada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//----------------------------------------------------------------------

//login
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

app.post('/', (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?');
    const usuario = stmt.get(correo, contraseña); // .get() devuelve un solo resultado

    if (usuario) {
      res.json({ success: true, rol: usuario.rol });
    } else {
      res.json({ success: false, mensaje: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
module.exports = app;