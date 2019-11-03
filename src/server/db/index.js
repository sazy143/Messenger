const mysql = require('mysql');
const config = require('../config');

const Users = require('./users');
console.log(config.mysql);

const Connection = mysql.createConnection(config.mysql);
exports.Connection = Connection;

Connection.connect(err => {
    if(err) console.log(err);
});


