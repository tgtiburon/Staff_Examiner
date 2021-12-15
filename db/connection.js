// to hide credentials
require("dotenv").config();
const mysql = require("mysql2");
// connect to db
const db = mysql.createConnection(

    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME,
    },
    console.log("Connected to the staff database. ")
);

module.exports=db;