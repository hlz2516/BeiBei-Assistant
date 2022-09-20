const mysql = require('mysql')

//建立与mysql的连接
const db = mysql.createPool({
    host:'119.45.240.180',
    user: 'root',
    password: 'Hlz19961211/',
    database: 'interview',
    timeout: 5000
})

module.exports = db;