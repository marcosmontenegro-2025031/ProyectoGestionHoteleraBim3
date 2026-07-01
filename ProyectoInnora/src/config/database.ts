import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: "localhost",
  user: "IN5CM",
  password: "?donmoA5m@",
  database: "DBGestionHotel_in5cm"
});

connection.connect((err) => {
  if (err) {
    console.error('Se ha producido un error al conectar a la DB: ', err);
    return;
  } else {
    console.log('Se conecto correctamente a la DB')
  }
});

export default connection;