import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'mysql-961012f-omarbusiness100k-0f55.a.aivencloud.com',
  port: 14176,
  user: 'avnadmin',
  password: 'AVNS_QqZaPwCfIdHr6WNDXR3',
  database: 'ReHome',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export { pool }; 