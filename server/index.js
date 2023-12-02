const express=require("express");
const app=express();
const mysql=require("mysql");
const cors =require("cors");


app.use(cors());
app.use(express.json());


const db=mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"pronosticos"
});
db.connect((err) => {
        if (err) {
                console.error('Error al conectar a la base de datos: ' + err);
        } else {
                console.log('Conexión a la base de datos exitosa');
        }
});


app.get("/empleados",(req,res)=>{
        const{jornada,torneo,fecha}=req.query;
        const sql = 'SELECT * FROM resultados WHERE jornada = ? AND torneo = ? AND YEAR(fecha) = ?';
        db.query(sql,[jornada,torneo,fecha], (err,result)=>{
                if (err) throw err; res.json(result);});
})


app.get('/anio', (req, res) => {
        db.query('SELECT DISTINCT YEAR(fecha) AS anio FROM resultados', (err, result) => {
                if (err) throw err; res.json(result);
        });});

app.get('/torneos/:anio', (req, res) => {
        const anio = req.params.anio;
        db.query('SELECT DISTINCT torneo FROM resultados WHERE YEAR(fecha) = ?', [anio], (err, result) => {
                if (err) throw err; res.json(result);
});});

app.get('/jornadas/:anio/:torneo', (req, res) => {
        const anio = req.params.anio;
        const torneo = req.params.torneo;
        db.query('SELECT DISTINCT jornada FROM resultados WHERE YEAR(fecha) = ? AND torneo = ?', [anio, torneo], (err, result) => {
                if (err) throw err; res.json(result);
});});

app.get('/resultadosfiltro/:anio/:torneo/:jornada', (req, res) => {
        const { anio, torneo, jornada } = req.params;
        const sql = 'SELECT * FROM resultados WHERE YEAR(fecha) = ? AND torneo = ? AND jornada=?';
        db.query(sql, [anio, torneo, jornada], (err, result) => {
        if (err) {console.log(err);} else {res.json(result);}
});});
        
app.get("/comparacionequipos",(req,res)=>{
        const{local,visita,fecha,limite}=req.query;
        const sql = `select * from resultados where (local='${local}' and visita='${visita}') or (local = '${visita}' AND visita= '${local}') order by fecha desc limit ${limite}`;
        db.query(sql,[local,visita,fecha], (err,result)=>{
                if(err){console.log(err);}else{res.json(result);}
});});
app.get("/local",(req,res)=>{
        const{local,visita,fecha,limite}=req.query;
        const sql = `select * from resultados where local='${local}' and visita='${visita}' order by fecha desc limit ${limite}`;
        db.query(sql,[local,visita,fecha], (err,result)=>{
                if(err){console.log(err);}else{res.json(result);}
});});

app.get("/pruebas",(req,res)=>{
        const{local,visita,fecha,limite}=req.query;
        const sql = `select * from resultados where local='${local}' and visita='${visita}' order by fecha desc limit ${limite}`;
        db.query(sql,[local,visita,fecha], (err,result)=>{
                if(err){console.log(err);}else{res.json(result);}
});});

app.get("/analizar1equipo",(req,res)=>{
                const{local,fecha,limite}=req.query;
                const sql = `select * from resultados where local='${local}' or visita='${local}' order by fecha desc limit ${limite}`;
                db.query(sql,[local,limite,fecha], (err,result)=>{
                        if(err){console.log(err);}else{res.json(result);}
});});

app.get("/alocal",(req,res)=>{
        const{local,fecha,limite}=req.query;
        const sql = `select * from resultados where local='${local}'  order by fecha desc limit ${limite}`;
        db.query(sql,[local,limite,fecha], (err,result)=>{
                if(err){console.log(err);}else{res.json(result);}
});});


app.get("/bvisita",(req,res)=>{
        const{visita,limite}=req.query;
        const sql = `select * from resultados where visita='${visita}' order by fecha desc limit ${limite}`;
        db.query(sql,[visita,limite], (err,result)=>{
                if(err){console.log(err);}else{res.json(result);}
});});

app.get("/vslocalapp", (req, res) => {
        const sql = "SELECT DISTINCT local FROM resultados";
        db.query(sql, (err, result) => {
                if (err) {console.log(err);} else {res.send(result);}
});});

app.get("/vsvisitaapp", (req, res) => {
        const sql = "SELECT DISTINCT visita FROM resultados";
        db.query(sql, (err, result) => {
                if (err) {console.log(err);} else {res.send(result);}
});});
        

app.get("/estadisticasxjornadas/:anio/:torneo/:jornada", (req, res) => {
        const { anio, torneo, jornada } = req.params; // Cambiado de req.query a req.params
        const sql = `SELECT ganador, COUNT(*) FROM resultados WHERE YEAR(fecha) = ? AND torneo = ? AND jornada = ? GROUP BY ganador;`;
                db.query(sql, [anio, torneo, jornada], (err, result) => {
                if (err) {console.log(err);} else {res.json(result);}
});});


app.get("/mercados/:anio/:torneo/:jornada", (req, res) => {
        const { anio, torneo, jornada } = req.params; // Cambiado de req.query a req.params
        const sql = `SELECT sum(btts),sum(masuno), sum(masdos),sum(mastres), COUNT(*) FROM resultados WHERE YEAR(fecha) = ? AND torneo = ? AND jornada = ?`;
                db.query(sql, [anio, torneo, jornada], (err, result) => {
                if (err) {console.log(err);} else {res.json(result);}
});});

app.get("/enfrentamientosdirectos/:local/:visita/:limit", (req, res) => {
        const { local, visita, limit } = req.params; // Cambiado de req.query a req.params
        const sql = `SELECT  * FROM resultados where (local=? and visita=?) or (local=? and visita=?) ORDER by fecha DESC LIMIT ?`;
                db.query(sql, [local, visita,visita,local, parseInt(limit)], (err, result) => {
                if (err) {console.log(err);} else {res.json(result);}
});});


app.get("/unovsuno/:local/:visita/:limit", (req, res) => {
        const { local, visita, limit } = req.params;
        const sql = `
                SELECT SUM(btts),SUM(masuno), SUM(masdos),SUM(mastres),YEAR(fecha), count(*)
                FROM ( SELECT local, visita, btts, fecha, masuno,masdos,mastres
                FROM resultados WHERE (local = ? AND visita = ?) OR (local = ? AND visita = ?)
                ORDER BY fecha DESC LIMIT ?) AS subquery;`;
                db.query(sql, [local, visita, visita, local, parseInt(limit)], (err, result) => {
                if (err) {console.log(err);} else {res.json(result);}
});});
        
        
app.get("/estadisticalocal/:local/:limit", (req, res) => {
        const { local, limit } = req.params; // Cambiado de req.query a req.params
        const sql = `SELECT  ganador, COUNT(*)FROM resultados WHERE local = ?  GROUP BY  ganador, fecha ORDER BY fecha DESC, ganador DESC LIMIT ?;`;
                db.query(sql, [local,  parseInt(limit)], (err, result) => {
                if (err) {console.log(err);} else {res.json(result);}
});});

app.listen(3003,()=>{
        console.log("corriendo en el puerto 3003")
})


