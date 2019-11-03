import React, {Component} from 'react';
const md5 = require('md5');

//Component to handle user registration
class SignUp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            email: '',
            usernameErrors: '',
            passwordErrors: '',
            emailErrors: '',
            response: ''
        }
    }
    
    //Validate user input
    handleChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        
        this.setState({
            [name]: value
        });
        
        switch(name) {
            
            /*****CHECKS TO ADD *****
            -NO SPACES (regexs)
            -PASSWORD HAS NUMBERS AND SYMBOLS
            *************************/
                
            case 'username':
                let nameErrors='';
                if(value.length===0){
                    nameErrors = '';
                }else if(value.length < 5){
                    nameErrors = 'Username must be atleast 5 characters long.';
                }
                this.setState({
                    usernameErrors: nameErrors
                })
                break;
            case 'password':
                let passwordErrors='';
                if(value.trim().length===0){
                    passwordErrors = '';
                }else if(value.trim().length < 8){
                    passwordErrors = 'Password must be atleast 8 characters long.'
                }
                
                this.setState({
                    passwordErrors: passwordErrors
                });
                break;
            case 'email':
                let emailErrors='';
                if(value.trim().length===0){
                    emailErrors = '';
                }else if(value.indexOf('@')===-1){
                    emailErrors = 'Emails require "@" symbol.';
                }else if(value.indexOf('.')===-1){
                    emailErrors = 'Emails require a "."domain.';
                }else if(value.indexOf('.')<=value.indexOf('@') || value.indexOf('.')===value.length-1){
                    emailErrors = 'Enter a valid email.';
                }
                this.setState({
                    emailErrors: emailErrors
                })
                break;
        }
        
    }
    
    onSubmit = (event) => {
        event.preventDefault();
        //check if form is valid and set it accordingly
        if(this.state.usernameErrors!==''||this.state.passwordErrors!=='' || this.state.emailErrors!==''|| this.state.username.trim()===''|| this.state.password.trim()==='' || this.state.email.trim() === ''){
            alert('please fix the errors noted');
            return;
        }
        const bod = JSON.stringify({
            userName: this.state.username,
            password: md5(this.state.password),
            email: this.state.email
        });
        fetch('/api/registerUser', {
            method: 'POST',
            body: bod,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if(res.status ===200){
                res.json().then((data)=>{
                    console.log(data.message);
                    this.setState({
                        response: data.message
                    });
                });
            }
        }).catch( err => {
            console.log(err);
        });
    }
    
    render(){
        let errmsg = '';
        if(this.state.response === 'success'){
            errmsg = <p>account created <strong onClick={this.props.goToLogin}>login</strong></p>
        }
        else if(this.state.response!== ''){
            errmsg = <p>{this.state.response}</p>;
        }
        return(
            <div className='signup'>
                <form className='form1' onSubmit={this.onSubmit}>
                    {errmsg}
                    <h1>Sign-Up</h1>
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
                            onChange={this.handleChange} 
                            value={this.state.username}
                            required
                        />

                    </label>
                    <p className='formError'>{this.state.usernameErrors}</p>
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
                    <p className='formError'>{this.state.passwordErrors}</p>
                    <label>
                        Email
                        <input 
                            type='email' 
                            name='email' 
                            value={this.state.email}
                            onChange={this.handleChange}
                            required
                        />

                    </label>
                    <p className='formError'>{this.state.emailErrors}</p>
                    <input 
                        className='formSubmit' 
                        type='submit' 
                        value='Sign-Up' 
                    />
                </form>
            </div>
        );
    }
}

export default SignUp;