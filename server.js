const express= require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config();

const PORT = 8080
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.json());

function obtenerDatosDesdeBD(callback) {
  const db = mysql.createConnection({
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
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
// Función para insertar datos en la base de datos
function insertarDatosEnBD(datos, callback) {
  const db = mysql.createConnection({ host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
   
  });

  db.connect((err) => {
    if (err) {
      callback(err, null);
    } else {
      const { nombre, email, password } = datos;
      const consultaSQL = 'INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)';
      
      db.query(consultaSQL, [nombre, email, password], (err, resultado) => {
        db.end(); // Cierra la conexión después de la consulta
        callback(err, resultado);
      });
    }
  });
}
// Luego, puedes utilizar la función obtenerDatosDesdeBD en tu ruta de Express
app.post('/crear-datos', (req, res) => {
  const { nombre, email, password } = req.body;

  insertarDatosEnBD({ nombre, email, password }, (err, resultado) => {
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

