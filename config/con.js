const mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit:1000,
    host: '193.203.184.36',
    user: 'u786034410_nodejs',
    password: 'Node@123$',
    database: 'u786034410_nodejs'
});

module.exports = pool;
