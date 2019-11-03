const DB = require('./db/users.js');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const app = express();
const port = process.env.PORT || 5000;
const socket = require('socket.io');
const withAuth = require('./middleware');

//move this somewhere later
const secret = 'secret';

app.use(bodyParser.json());
app.use(cookieParser());

const server = app.listen(port, () => console.log(`Server listening on port: ${port}`));

//METHOD TO GET ALL REGISTERED USERS FROM DB
app.get('/api/users', async (req, res) => {
    try {
        let users = await DB.allUsers();
        //console.log(users);
        res.json(users);
//        const result = res.json(users);
//        console.log(result);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
})

//METHOD TO REMOVE TOKEN COOKIE
app.get('/api/removeCookie', (req,res) => {
    try{
        res.clearCookie('token');
        res.sendStatus(200);
    }catch(e){
        console.log(e);
    }
})

//METHOD TO LOGIN A USER/CHECK IF ENTERED INFO IS VALID
app.post('/api/checkLogin', async (req,res) => {
    console.log(req.body);
    const {username, password} = req.body;
    try{
        let state = await DB.checkPassword(username, password);
        if(!state){
            res.status(401).json({
                message: 'There was an error'
            });
        }
        else if(state){
            console.log(state);
            if(state ==='success'){
                const payload = {username};
                const token = jwt.sign(payload, secret, {
                    expiresIn: '1h'
                });
                res.cookie('token',token, {httpOnly: true});
                res.cookie('userName', username);
            }
            res.status(200).json({
                message: state
            });
        } else {
            res.status(6969).json({
                message: 'idk mane'
            });
        }
    } catch(e) { 
        console.log(e);
    }
})

//METHOD TO REGISTER A USER INTO THE DATABASE
app.post('/api/registerUser', async(req,res) => {
    console.log(req.body);
    
    const {userName, password, email} = req.body;
    
    try{
        let state = await DB.registerUser(userName, password, email);
        if(!state){
            res.status(401).json({
                message: 'There was an error'
            });
        } else if (state) {
            console.log(state);
            res.status(200).json({
                message: state
            });
        } else {
            res.status(6969).json({
                message: 'idk mane'
            });
        }
    } catch(e) {
        console.log(e);
    }
});

//CHECK WEBTOKEN
app.get('/api/checkToken', withAuth, (req, res) => {
    res.sendStatus(200);
})

//CODE TO SETUP OUR SOCKET
let clients = {};
const io = socket(server);

io.on('connection', (socket) => {
    console.log(`Socket ${socket.id} connected`);
    
    socket.on('chat', data => {
        io.sockets.emit('chat', data);
        console.log('recieved and emited');
    });
    
    socket.on('login', data => {
        console.log(socket.id, data.userName);
        clients[socket.id] = data.userName;
        socket.broadcast.emit('login', data);
    });
    
    socket.on('disconnect', () => {
        socket.broadcast.emit('logout', {userName: clients[socket.id], action: 'logout'});
        delete clients[socket.id];
        console.log(`Socket ${socket.id} disconnected`);
    });
});

//GET HOW MANY USERS ARE ONLINE
app.post('/api/activeUsers', (req, res) => {
    const numUsers = Object.keys(clients).length;
    try{
        res.status(200).json({
            numUsers: numUsers
        });
    }catch(e){
        console.log(e);
    }
});








