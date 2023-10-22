const express= require('express')
const mysql = require('mysql2')
const bodyParser = require('body-parser')
const app = express()
const PORT = 8080
const connection = mysql.createConnection({
  host: 'containers-us-west-183.railway.app',
  port: '5439',
  user: 'root',
  password: 'l8buMHicvpHvn5EIhxne',
  database: 'railway'
});
app.use(bodyParser.json());




connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
  } else {
    console.log('Conexión exitosa a la base de datos MySQL');
  }
});

module.exports = connection;
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
  const consultaSQL = 'SELECT * FROM usuario';
  connection.query(consultaSQL, (err, resultados) => {
    if (err) {
      console.error('Error al consultar la base de datos: ' + err);
      res.status(500).json({ error: 'Error interno del servidor' });
    } else {
      res.json(resultados);
    }
  });
});

app.listen(PORT)

