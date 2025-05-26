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

  app.listen(app.get('port'), () =>
    {
    console.log(`Server listening on port ${config.app.port}`);
  });