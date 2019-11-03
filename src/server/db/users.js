//import  {Connection} from './index';
const connector = require('./index.js');
const mysql = require('mysql');

exports.allUsers = async () => {
    return new Promise((resolve, reject) => {
        //console.log(connector.Connection);
        connector.Connection.query('SELECT * FROM users', (err, results) => {
            if(err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}

exports.checkPassword = async (userName,password) => {
    return new Promise((resolve, reject) => {
        connector.Connection.query(`SELECT password FROM users WHERE userName=${mysql.escape(userName)}`, function (err, result){
            if(err){
                console.log(err);
                return reject(err);
            }
            if(result.length>0 && result[0].password===password){
                resolve('success');
            }else{
                resolve('Incorrect username or password');
            }
        });
    });
}

exports.registerUser = async (userName, password, email) => {
    return new Promise( (resolve, reject) => {
        connector.Connection.query(`SELECT id FROM users WHERE username=${mysql.escape(userName)} OR email=${mysql.escape(email)}`,
        function(err, result){
            if(err){
                console.log(err);
                return reject(err);
            }else if(result.length>0){
                return resolve('username or email already exists.');
            }else {
                connector.Connection.query(`INSERT INTO users (userName, password, email) VALUES (${mysql.escape(userName)}, ${mysql.escape(password)}, ${mysql.escape(email)})`, 
                function(err, result2){
                    if(err){
                        console.log(err);
                        return reject(err);
                    }
                    else {
                        resolve('success');
                        console.log('record inserted');
                    }
                });
            }
        });
    });     
}