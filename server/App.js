const http = require('http');
const express = require('express');
const mysql = require('mysql');
const router = express.Router();

//creacion de servidor//

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
});

server.listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
});

//creacion de servidor//

//conexion base de datos//
const connection = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"pronosticos"
});
connection.connect((err) => {
        if (err) {
                console.error('Error al conectar a la base de datos: ' + err.stack);
                return;
        }
        console.log('Conexión a la base de datos MySQL establecidaaaaaaaaaaaa');
});
//conexion base de datos//

router.get('/datos', (req, res) => {
        var resultados="SELECT * FROM `resultados` WHERE local='Melgar'";
        connection.query(resultados,function(error,lista){
        if(error){
                throw error;
                connection.end();
        }else{
                console.log(lista)
        }
});
});



