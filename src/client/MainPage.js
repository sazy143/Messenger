import React, {Component} from 'react';
import './MainPage.css';
import SignUp from './Signup.js';
import Login from './Login.js';
import ChatClient from './ChatClient.js';


//Component to show Login and Signup options
function Authbar(props) {  
    return(
        <div className='Authentication-Bar'>
            <button id='login' onClick={props.login}>Login</button>
            <button id='sign-up' onClick={props.signup}>Sign Up</button>
        </div>
    ); 
}

//The main component for the whole app
class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            loggedIn: false,
            authbarWindow: false,
            loginWindow: false,
            signupWindow: false,
            data: null,
            userName: null,
            activeComponent: null
        };
    }
    

    goToChat = () => {
        console.log('goToChat');
        this.setState({
            activeComponent: 'chatRoom'
        });
    }
    
    //function to show the login window, and handle the other windows
    login = () => {
        console.log('login clicked');
        this.setState({
            authbarWindow: false,
            loginWindow: true,
            signupWindow: false
        });
    }
    
    //function to show the signup window, and handle the other windows
    signup = () => {
        console.log('signup clicked');
        this.setState({
            authbarWindow: false,
            loginWindow: false,
            signupWindow:true
        });
    }
    
    //At the application start run this to check whether user is logged in 
    //and show correct components.
    checkLogin = () => {
        if(this.state.loggedIn === true){
            this.setState({
                authbarWindow: false,
                loginWindow: false,
                signupWindow: false
            });
        }
        if(this.state.loggedIn === false){
            this.setState({
                authbarWindow: true,
                loginWindow: false,
                signupWindow: false
            });
        }
        
    }
    setLogin = (userName) => {
        this.setState({
            loggedIn:true,
            authbarWindow: false,
            loginWindow: false,
            signupWindow: false,
            userName: userName
        });    
    }
    setLogout = () => {
        fetch('/api/removeCookie');
        document.cookie = 'userName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        this.setState({
            loggedIn: false,
            authbarWindow: true,
            loginWindow: false,
            signupWindow: false,
            userName: null,
            activeComponent: 'home'
        });
    }
    
    returnHome = () => {
        this.setState({
            activeComponent: 'home'
        });
    }
    
    //funtion to close login and signup window
    closeWindow = () => {
        this.checkLogin();
    }

    
    componentDidMount(){
        this.checkLogin();
        this.setState({
            activeComponent: 'home'
        });
        let cookie = document.cookie;
        let startIndex = cookie.indexOf('userName=');
        console.log(startIndex);
        if(startIndex===-1)
            return;
        let endIndex = (cookie.indexOf(';',startIndex+9)===-1 ? cookie.length : cookie.indexOf(';',startIndex+9));
        let value = cookie.substring(startIndex+9,endIndex);
        console.log(startIndex+9, endIndex, value, cookie);
        fetch('/api/checkToken').then(res => {
            if(res.status ===200) {
                console.log('token valid');
                this.setLogin(value);
            }else{
                console.log('not valid');
            }
        })
        
    }
    render() { 
        
        //CODE TO DISABLE/ENABLE GOING TO A CHAT ROOM BASED ON BEING LOGGED IN
        let buttonDisable = 'disabled';
        if(this.state.loggedIn){
            buttonDisable = '';
        }
        
        //CODE TO SET CHATROOM BUTTON FUNCTION BASED ON LOGGED IN STATE
        let chatButtonFunction;
        if(this.state.loggedIn){
            chatButtonFunction = this.goToChat;
        }
        else {
            chatButtonFunction= () => {alert('Log in to join a chat room')}
        }
        
        //CODE TO DECIDE WHICH WINDOW TO DISPLAY TO THE USER WHETHER THEY ARE LOGGING IN
        //SIGNING UP OR THEY ARE LOGGED IN
        let windowToShow;
        if(this.state.authbarWindow===true){
            windowToShow = <Authbar login={this.login} signup={this.signup} />
        }else if (this.state.loginWindow === true){
            windowToShow = <Login closeWindow = {this.closeWindow} loggedIn={this.setLogin}/>
        }else if (this.state.signupWindow === true){
            windowToShow = <SignUp closeWindow = {this.closeWindow} goToLogin={this.login}/>
        }else if(this.state.loggedIn===false){
            windowToShow = <Authbar login={this.login} signup={this.signup} />
        }else{
            windowToShow = null;
        }
        if(this.state.loggedIn){
            windowToShow= null;
        }
        
        //CODE TO SHOW A LOGOUT BUTTON IF THE USER IS LOGGED IN
        let logout;
        if(this.state.loggedIn){
            logout = <button className='logout' onClick={this.setLogout}>Log Out</button>;
        }
        
        //CODE FOR WELCOME MESSAGE IF USER IS LOGGED IN
        let welcome;
        if(this.state.loggedIn){
            welcome = <h1 className='welcome'>Welcome {this.state.userName}</h1>;
        }
        
        //SET THE ACTIVE COMPONENT TO BE RETURNED
        let compToShow;
        if(this.state.activeComponent==='home'){
            compToShow = <button className={`chatroom ${buttonDisable}`} onClick={chatButtonFunction}>Cooking Chat Room</button>;
        }else if(this.state.activeComponent==='chatRoom'){
            compToShow = <ChatClient return={this.returnHome} userName={this.state.userName}/>;
        }
        return(
            <div id='Main-Content'>
                {windowToShow}
                {logout}
                {welcome}
                <p>{this.state.data}</p>
                {compToShow}
            </div>
            );
        }
}

export default Main;
