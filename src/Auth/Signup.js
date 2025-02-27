import react, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const Signuppage = () => {
    const [user, Setuser] = useState({ name: "", email: "", password: "" });

    
    let navigate = useNavigate();
    //call for api sigup
    const Signup = async (name, email, password) => {
        const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/auth/createUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password })
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
        Signup(user.name, user.email, user.password);
    }
    return (
        <div className='outer_box'>
            <form className='login_container' onSubmit={handleSubmit}>
                <h1>Signup</h1>
                <div className='login_row'>
                    <h4 className='login_email'>Name</h4>
                    <input type='text' name='name' onChange={handleChange} required/>
                </div>
                <div className='login_row'>
                    <h4 className='login_email'>Email</h4>
                    <input type='email' name='email' onChange={handleChange} required />
                </div>
                <div className='login_row'>
                    <h4>Password</h4>
                    <input type='password' name='password' onChange={handleChange} required />
                </div>
                <button disabled={user.name.length<4 || user.password.length<5}>Submit</button>
            </form>
        </div>


    );
}