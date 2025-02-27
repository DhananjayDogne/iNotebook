import react from 'react';
import { Link } from 'react-router-dom';
import './About.css';


export const About = () => {
    
    return (
        <div className='about'>
            This is About page
            This is name 
            <Link to="/">This is link</Link>  
        </div>
    );
}