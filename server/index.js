const app = require('./app');
const config = require('./config');
const path = require('path');
const express = require('express');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'admin.html'));
});

app.get('/conta', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'conta.html'));
});

app.get('/recp', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'recp.html'));
});

app.get('/vet', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'vet.html'));
});
app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'usuarios', 'usuarios_read.html'));
});

app.get('/citas', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'citas', 'citas_read.html'));
});

app.get('/categorias', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Categorias', 'categorias_read.html'));
});

app.get('/clientes', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Clientes', 'clientes_read.html'));
});

app.get('/historiales', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Historiales', 'historiales_read.html'));
});

app.get('/inventario', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Inventario', 'inventario_read.html'));
});

app.get('/mascotas', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Mascotas', 'mascotas_read.html'));
});

app.get('/proveedores', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Proveedores', 'proveedores_read.html'));
});

app.get('/ventas', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'Ventas', 'ventas_read.html'));
});


  app.listen(app.get('port'), () =>
    {
    console.log(`Server listening on port ${config.app.port}`);
  });