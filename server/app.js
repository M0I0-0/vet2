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
  db = new Database(path.join(__dirname, '..', 'db', 'veterimid.db'), { readonly: false });
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



// Citas
app.get('/citas', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM citas');
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
    const stmt = db.prepare('SELECT * FROM historial_medico');
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
    const stmt = db.prepare('SELECT * FROM inventario');
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
    const stmt = db.prepare('SELECT * FROM mascotas');
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
    const stmt = db.prepare('SELECT * FROM facturas');
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