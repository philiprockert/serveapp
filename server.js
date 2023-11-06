const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(cors({
  origin: 'https://lively-horse-6aab78.netlify.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.options('/crear-datos', (req, res) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).send();
});

app.use(bodyParser.json());

const dbConfig = {
  host: process.env.DBHOST,
  port: process.env.DBPORT,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
  database: process.env.DBNAME
};

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

// Función para insertar datos en la base de datos
function insertarDatosEnBD(datos, callback) {
  const { nombre, email, password } = datos;
  const consultaSQL = 'INSERT INTO usuario (nombre, email, password) VALUES (?, ?, ?)';

  promisePool.query(consultaSQL, [nombre, email, password])
    .then(([resultado]) => {
      callback(null, resultado);
    })
    .catch((err) => {
      callback(err, null);
    });
}

// Ruta para insertar datos
app.post('/crear-datos', (req, res) => {
  const { nombre, email, password } = req.body;

  insertarDatosEnBD({ nombre, email, password }, (err, resultado) => {
    if (err) {
      console.error('Error al insertar datos en la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' + err });
    } else {
      res.json({ mensaje: 'Datos insertados con éxito' });
    }
  });
});

// Ruta para obtener datos
app.get('/', (req, res) => {
  const consultaSQL = 'SELECT * FROM usuario';

  promisePool.query(consultaSQL)
    .then(([resultados]) => {
      res.json(resultados);
    })
    .catch((err) => {
      console.error('Error al consultar la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' });
    });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor Express en ejecución en el puerto ${PORT}`);
});
