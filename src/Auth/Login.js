import react, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';
const Login = () => {
    const [user, Setuser] = useState({ email: "dd4321@gmail.com", password: "dd4321" });
    let navigate = useNavigate();
    const LoginUser = async () => {

        const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email:user.email, password:user.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) { 
            //Save And Redirect To Home
            localStorage.setItem("token", json.token)
            localStorage.setItem("role", json.role)
            navigate('/');
        } else {
            if (json.error) alert(json.error);
            else {
                alert("Some error occurred .PLease try again !");
            }
        }
    }

    const handleChange = (e) => {
        Setuser({ ...user, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        LoginUser();
    }
    return (
        <div className='outer_box'>
            <form className='login_container' onSubmit={handleSubmit}>
                <h1>Login</h1>
              
                <div className='login_row'>
                    <h4 className='login_email'>Email</h4>
                    <input type='email' name='email' onChange={handleChange} required />
                </div>
                <div className='login_row'>
                    <h4>Password</h4>
                    <input type='password' name='password' onChange={handleChange} required />
                </div>
                <button disabled={ user.password.length < 5} >Submit</button>
            </form>
        </div>

        
    );
}
export default Login;