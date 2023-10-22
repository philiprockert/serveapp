const express= require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8080


function obtenerDatosDesdeBD(callback) {
  const db = mysql.createConnection({
    host: 'containers-us-west-183.railway.app',
  port: '5439',
  user: 'root',
  password: 'l8buMHicvpHvn5EIhxne',
  database: 'railway'
  });

  db.connect((err) => {
    if (err) {
      callback(err, null);
    } else {
      const consultaSQL = 'SELECT * FROM usuario';
      db.query(consultaSQL, (err, resultados) => {
        db.end(); // Cierra la conexión después de la consulta
        callback(err, resultados);
      });
    }
  });
}

// Luego, puedes utilizar la función obtenerDatosDesdeBD en tu ruta de Express



app.use(bodyParser.json());







app.post('/crear-datos', (req, res) => {
  const { nombre, email, password } = req.body; // Los campos deben coincidir con la estructura de tu tabla
  const consultaSQL = 'INSERT INTO usuario ( nombre, email, password) VALUES (?, ?, ?)';
  
  connection.query(consultaSQL, [nombre, email, password], (err, resultado) => {
    if (err) {
      console.error('Error al insertar datos en la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json({ mensaje: 'Datos insertados con éxito' });
    }
  });
});



app.get('/', (req, res) => {
  obtenerDatosDesdeBD((err, resultados) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(resultados);
    }
  })
});

app.listen(PORT)

