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


// Obtener todos los usuarios
app.get('/usuarios', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM usuarios');
    const usuarios = stmt.all(); // .all() para múltiples resultados
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar usuario
app.delete('/usuarios/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM usuarios WHERE id_usuario = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Obtener usuario por id para el update
app.get('/usuarios/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('SELECT * FROM usuarios WHERE id_usuario = ?');
    const usuario = stmt.get(id); // solo un resultado
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Actualizar usuario
app.post('/usuarios_update', (req, res) => {
  try {
    const { id_usuario, nombre, correo, contraseña, rol } = req.body;

    const stmt = db.prepare(`UPDATE usuarios
                             SET nombre = ?, correo = ?, contraseña = ?, rol = ?
                             WHERE id_usuario = ?`);

    const result = stmt.run(nombre, correo, contraseña, rol, id_usuario);

    if (result.changes > 0) {
      // Redireccionar a la página anterior
      const referer = req.get('Referer'); // si no hay, va a la raíz
      res.redirect(referer);
    } else {
      res.status(404).send('Usuario no encontrado o sin cambios');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});






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
      u.nombre AS veterinario_rol
      FROM citas c
      JOIN usuarios u ON c.id_veterinario = u.id_usuario;`);
    const citas = stmt.all(); // .all() para múltiples resultados
    res.json(citas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/citas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM usuarios WHERE id_cita = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categorias
app.get('/categorias', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM categoria');
    const categorias = stmt.all(); // .all() para múltiples resultados
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete('/categorias/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM usuarios WHERE id_categoria = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Usuario eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CLIENTES
app.get('/clientes', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM clientes');
    const clientes = stmt.all();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/clientes/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM clientes WHERE id_cliente = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Cliente eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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
});

app.delete('/historiales/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM historial_medico WHERE id_historial = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Historial eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Historial no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.delete('/inventario/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM inventario WHERE id_inventario = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Producto eliminado del inventario' });
    } else {
      res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.delete('/mascotas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM mascotas WHERE id_mascota = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Mascota eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Mascota no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PROVEEDORES
app.get('/proveedores', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM proveedores');
    const proveedores = stmt.all();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/proveedores/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM proveedores WHERE id_proveedor = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Proveedor no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// VENTAS
app.get('/ventas', (req, res) => {
  try {
    const stmt = db.prepare(`SELECT f.id_factura, f.fecha, f.total, c.nombre AS cliente_nombre
            FROM ventas f
            JOIN clientes c ON f.id_cliente = c.id_cliente
            order by f.id_factura asc`);
    const ventas = stmt.all();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/ventas/:id', (req, res) => {
  try {
    const id = req.params.id;
    const stmt = db.prepare('DELETE FROM facturas WHERE id_factura = ?');
    const result = stmt.run(id);
    if (result.changes > 0) {
      res.json({ mensaje: 'Venta eliminada correctamente' });
    } else {
      res.status(404).json({ mensaje: 'Venta no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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