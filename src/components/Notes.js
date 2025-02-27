import { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import NoteContext from '../context/notes/NoteContext';
import { Noteitem } from './Noteitem';
import './Notes.css';

export const Notes = () => {
    const { notes, fetchNotes } = useContext(NoteContext);
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            if(localStorage.getItem('role')!=="admin")fetchNotes();
        } else {
            navigate("/login");
        }
    }, []);
    
    return (
        <>
            <div className='all_contacts'>
                <h1>Your Contacts : </h1>
                <Link to="/addnote" className="add-contact-button">
                   + Add a Contact
                </Link>
            </div>
            
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", width: "100%", textAlign: "center" }}>
                {notes.length === 0 && 'No notes to display. Please Add Some Notes ! '}
            {notes.map((note) => {
                return <Noteitem key={note._id} note={note} />
                       
            })}
            
            </div>
        </>
    );
}