const express= require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('dotenv').config();
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Si necesitas enviar cookies o credenciales
}));


const PORT = 8080

const pool = mysql.createPool(dbConfig);

const promisePool = pool.promise();


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
  const db = mysql.promisePool({ host: process.env.DBHOST,
    port: process.env.DBPORT,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME
   
  });

  db.connect((err) => {
    if (err) {
      callback(err, null);
    } else {
      const {nombre, email, password } = datos;
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
  const {id,  nombre, email, password } = req.body;

  insertarDatosEnBD({id,  nombre, email, password }, (err, resultado) => {
    if (err) {
      console.error('Error al insertar datos en la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' + err });
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

