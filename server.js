const express = require('express');
const sqlite3 = require('sqlite').verbose();
const path = require('path');
const cors = require('cors'); // Importa CORS

const app = express();
const PORT = process.env.PORT || 3000;

// Ruta a la base de datos dentro de /database
const dbPath = path.join(__dirname, 'personajes.db');
const db = new sqlite3.Database(dbPath);

// Middleware para archivos estáticos y JSON
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());  // Habilita CORS

// Ruta para obtener todos los personajes (con imagen)
app.get('/api/personajes', (req, res) => {
  db.all('SELECT id, personaje, nombre, imagen FROM personajes', (err, rows) => {
    if (err) {
      console.error('Error al obtener personajes:', err);
      return res.status(500).json({ error: 'Error al obtener personajes' });
    }
    console.log('Personajes obtenidos:', rows);
    res.json(rows);
  });
});

// Ruta para asignar un nombre a un personaje (una sola vez)
app.post('/api/asignar', (req, res) => {
  const { id, nombre } = req.body;

  if (!id || !nombre) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  db.get('SELECT nombre FROM personajes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error al verificar personaje:', err);
      return res.status(500).json({ error: 'Error al verificar personaje' });
    }

    if (row && row.nombre) {
      return res.status(403).json({ error: 'Este personaje ya fue asignado' });
    }

    db.run('UPDATE personajes SET nombre = ? WHERE id = ?', [nombre, id], function (err) {
      if (err) {
        console.error('Error al asignar nombre:', err);
        return res.status(500).json({ error: 'Error al asignar nombre' });
      }
      console.log(`Nombre asignado al personaje ID ${id}: ${nombre}`);
      res.json({ success: true });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
