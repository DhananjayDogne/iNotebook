
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';



export const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }
    return (
        <div className='navbar'>
            <div className='logo'>iNoteBook</div>
            <div className='links'>
                <Link className={`link ${location.pathname==='/'? "active": ""}`}   to='/'>Home</Link>
                <Link className={`link ${location.pathname==='/about'?  "active": ""}`}  to='/about'>About</Link>
            </div>
            <div>
                  
                {!localStorage.getItem('token') ? (<>
                    <Link className={`link ${location.pathname === '/login' ? "active" : ""}`} to='/login'>Login</Link>
                    <Link className={`link ${location.pathname === '/signup' ? "active" : ""}`} to='/signup'>Signup</Link>
                </>)
                    :
                    (<h5 className="nav_logout" onClick={handleLogout}>Logout</h5>)}
                   
            </div>
        </div>
    );
}