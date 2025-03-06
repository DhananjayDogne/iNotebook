import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import "./AddNote.css";

import NoteContext from "../context/notes/NoteContext";

export const AddNote = () => {
    const { addNotes, fetchNotes } = useContext(NoteContext);
    const navigate = useNavigate();
    const [note, setNote] = useState({
        name: "",
        email: "",
        mobile: "",
        mother: "",
        father: "",
        address: ""
    });

    const handleClick = () => {
        addNotes(note.name, note.email, note.mobile, note.mother, note.father, note.address);
        setNote({ name: "", email: "", mobile: "", mother: "", father: "", address: "" }); 
        fetchNotes(); 
        navigate('/');
    }

    const onChange = (e) => {
        e.preventDefault(); 
        setNote({ ...note, [e.target.name]: e.target.value }); 
    }

    return (
        <div className='adduser'>
            <h1>Add Contact</h1>
            <div className='form_container'>
                <form className='form_body'>
                    <div className='row'>
                        <label>Name</label>
                        <input type="text" name="name" required value={note.name} placeholder='Enter name' onChange={onChange} />
                    </div>

                    <div className='row'>
                        <label>Email</label>
                        <input type="email" name="email" required value={note.email} placeholder='Enter email' onChange={onChange} />
                    </div>

                    <div className='row'>
                        <label>Mobile</label>
                        <input type="text" name="mobile" required value={note.mobile} placeholder='Enter mobile number' onChange={onChange} />
                    </div>

                    <div className='row'>
                        <label>Mother's Name</label>
                        <input type="text" name="mother" value={note.mother} placeholder='Enter mother name' onChange={onChange} />
                    </div>

                    <div className='row'>
                        <label>Father's Name</label>
                        <input type="text" name="father" value={note.father} placeholder='Enter father name' onChange={onChange} />
                    </div>

                    <div className='row'>
                        <label>Address</label>
                        <textarea name="address" value={note.address} placeholder='Enter address' rows={4} onChange={onChange} />
                    </div>
                </form>
                <button onClick={handleClick}>Add User</button>
            </div>
        </div>
    );
}