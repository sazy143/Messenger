import React, {Component} from 'react';
import socketIOClient from 'socket.io-client';
let socket;
class ChatClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            server: 'https://68.146.0.255/chat',
            message: '',
            userName: this.props.userName,
            messagesSent: 0,
            allMessages: [],
            numUsers: 0
        }
        socket = socketIOClient(this.state.server, {secure:true, rejectUnauthorized: false, path: '/chat/socket.io'});
    }
    messagesEndRef = React.createRef();
    scrollToBottom = () => {
        this.messagesEndRef.current.scrollIntoView({behavior: 'smooth'});
    }

    
    //FUNCTION TO SEND A CHAT MESSAGE FROM SEND
    sendMessage = (event) => {
        event.preventDefault();
        if(this.state.message.trim()===''){
            this.setState({
                message: ''
            });
            return;
        }
        
        socket.emit('chat', {
            message: this.state.message,
            userName: this.state.userName
        });
        this.setState({
            message: '',
            messagesSent: this.state.messagesSent + 1
        });
    }
    
   
    
    //HANDLE CHANGE
    handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        
        this.setState({
            [name]: value
        });
    }
    
    componentDidMount() {
        //MESSAGE FOR SERVER TO STORE USER INFO ON LOGIN TO ROOM
        socket.emit('login', {
            userName: this.state.userName
        });
        
        
        //LISTEN FOR A CHAT MESSAGE
        socket.on('chat', data => {
            console.log('message recieved');
            let allMessages = this.state.allMessages;
            allMessages.push(data);
            this.setState({
                allMessages: allMessages
            });
        });
        socket.on('login', data => {
            console.log('new user joined');
            let allMessages = this.state.allMessages;
            allMessages.push(data);
            fetch('/api/activeUsers',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(res =>{
                if(res.status ===200) {
                    res.json().then((data)=>{
                        this.setState({
                            numUsers: data.numUsers
                        });
                    });
                }
            }).catch(err => {
                    console.log(err);
                    alert(err);
            });
            this.setState({
                allMessages: allMessages
            });
        });
        socket.on('logout', data =>{
            let allMessages = this.state.allMessages;
            allMessages.push(data);
            fetch('/api/activeUsers',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(res =>{
                if(res.status ===200) {
                    res.json().then((data)=>{
                        this.setState({
                            numUsers: data.numUsers
                        });
                    });
                }
            }).catch(err => {
                    console.log(err);
                    alert(err);
            });
            this.setState({
                allMessages: allMessages,
            });
        });
        setTimeout(() => {fetch('/api/activeUsers',{
                method:'POST',
                headers: {
                    'Content-Type':'application/json'
                }
            }).then(res =>{
                if(res.status ===200) {
                    res.json().then((data)=>{
                        this.setState({
                            numUsers: data.numUsers
                        });
                    });
                }
            }).catch(err => {
                    console.log(err);
                    alert(err);
            });},1000);
    }

    componentWillUnmount() {
        //CLOSE EVERYTHING!!!
        socket.disconnect();
    }

    componentDidUpdate(){
        this.scrollToBottom();
    }
    
    render() {
        let chatMessages = this.state.allMessages.map((data) => {
            let msg;
            if(data.action === 'logout'){
                msg = <div className='message'><p>{data.userName} has disconnected</p></div>;
            }else if(!data.message){
                msg = <div className='message'><p>{data.userName} has connected</p></div>;
            }else{
                msg = <div className='message'><p><strong>{data.userName}: </strong>{data.message}</p></div>;
            }
            return msg;
        });
        return(
            <div className='chatClient'>
                <button className='chatroomBackButton' type='button' onClick={this.props.return}></button>
                <div className='numUsers'><p>{this.state.numUsers} online</p></div>
                <div className='messagesRecieved'>
                    {chatMessages}
                    <div ref={this.messagesEndRef} id='anchor'></div>
                </div>
                <div className='messageSend'>
                    <form className='chatClient' onSubmit={this.sendMessage}>
                        <button type='submit' id='send' onClick={this.sendMessage} >Send</button>
                        <input placeholder='message goes here' name='message' type='text' value={this.state.message} onChange={this.handleChange}/>
                    </form>
                    
                </div>
            </div>
        )
    }
}
export default ChatClient;
