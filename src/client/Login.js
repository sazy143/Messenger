import React, {Component} from 'react';
const md5 = require('md5');

//Component to handle user login
class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            response: ''
        }
    }
    
    handleChange = (event) => {
        const {value , name} = event.target;
        this.setState({
            [name]:value
        });
    }
    
    onSubmit = (event) => {
        event.preventDefault();
        fetch('/api/checkLogin', {
            method:'POST',
            body: JSON.stringify({username: this.state.username, password: md5(this.state.password)}),
            headers: {
                'Content-Type':'application/json'
            }
        }).then(res => {
            if(res.status ===200) {
                res.json().then((data)=>{
                    console.log(data.message);
                    this.setState({
                        response: data.message
                    });
                });
            } else if(res.status ===401){
                alert('server error try again later');       
            }else{
                const error = new Error(res.error);
                throw error;
            }
        }).catch(err => {
            console.log(err);
            alert(err);
        });
    }
    
    render(){
        let errmsg = '';
        if(this.state.response === 'success'){
            this.props.loggedIn(this.state.username);
        }
        else if(this.state.response!== ''){
            errmsg = <p>{this.state.response}</p>;
        }
        return(
            <div className='login'>
                <form className='form1' onSubmit={this.onSubmit}>
                    {errmsg}
                    <h1>Login</h1>
                    <button 
                        className='backButton' 
                        onClick={this.props.closeWindow}
                        type='button'>
                    </button>
                    <label>
                        Username
                        <input 
                            type='text' 
                            name='username'
                            value={this.state.username}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password
                        <input 
                            type='password' 
                            name='password' 
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                    </label>
                    <input 
                        className='formSubmit' 
                        type='submit' 
                        value='Login'
                        onSubmit={this.onSubmit}
                    />
                </form>
            </div>
        );
    }
}

export default Login;