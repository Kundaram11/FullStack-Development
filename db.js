const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",      // Replace with your MySQL password if you have one
    database: "blogdb"
});

connection.connect((err) => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err);
        return;
    }

    console.log("✅ Connected to MySQL Database");
});

module.exports = connection;