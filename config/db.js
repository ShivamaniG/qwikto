const mysql = require("mysql2/promise");

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
        host: 'qwikto.cpsuu02661o9.ap-south-1.rds.amazonaws.com',
        user: 'admin',   
        password: 'Karideep123', 
        database: 'qwikto', 
        port: 3306,  
    });

    console.log("Connected to AWS RDS MySQL...");
    return connection;
  } catch (err) {
    console.error("MySQL connection error: ", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
