import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Rmdec@2001", 
  database: "kce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

console.log("DB connected successfully");

export default pool;
