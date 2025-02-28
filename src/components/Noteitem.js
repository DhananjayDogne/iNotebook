import { useState, useContext } from 'react';
import "./Noteitem.css";
import NoteContext from "../context/notes/NoteContext";

export const Noteitem = ({ note }) => {
    const context = useContext(NoteContext);
    const { deleteNote, editNote } = context;

    const [popup, setPopup] = useState("popup");
    const [newnote, setNewnote] = useState({
        id: note._id,
        name: note.name,
        email: note.email,
        mobile: note.mobile,
        mother: note.mother,
        father: note.father,
        address: note.address
    });

    const popup2 = () => {
        setPopup([popup + " poped"]);
    };

    const popupremove = () => {
        setPopup(["popup"]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Editing a note");
        console.log(newnote);
        editNote(newnote.id, newnote.name, newnote.email, newnote.mobile, newnote.mother, newnote.father, newnote.address);
        popupremove();
    };

    const handleChange = (e) => {
        e.preventDefault();
        setNewnote({ ...newnote, [e.target.name]: e.target.value });
    };

    return (
        <>
            <div className='card'>
                <h3 className='card-title'>Contact Details</h3>
                <h4>Name: {newnote.name}</h4>
                <p>Email: {newnote.email}</p>
                <p>Mobile: {newnote.mobile}</p>
                <p>Mother: {newnote.mother}</p>
                <p>Father: {newnote.father}</p>
                <p>Address: {newnote.address}</p>
                <div className="icon-container">
                    <i className="fa-solid fa-trash-can trash" onClick={() => { deleteNote(note._id); }}></i>
                    <i className="fa-regular fa-pen-to-square edit" onClick={popup2}></i>
                </div>
            </div>
            <div className={`${popup}`}>
                <div className="heading">
                    <h5>Edit</h5>
                    <i className="fa-regular fa-circle-xmark" onClick={popupremove}></i>
                </div>
                <form>
                    <div className='popup_row1'>
                        <label>Name</label>
                        <input name="name" type="text" value={newnote.name} required onChange={handleChange} placeholder="Please enter name" />
                    </div>
                    <div className='popup_row1'>
                        <label>Email</label>
                        <input name="email" type="email" value={newnote.email} required onChange={handleChange} placeholder="Please enter email" />
                    </div>
                    <div className='popup_row1'>
                        <label>Mobile</label>
                        <input name="mobile" type="text" value={newnote.mobile} required onChange={handleChange} placeholder="Please enter mobile number" />
                    </div>
                    <div className='popup_row1'>
                        <label>Mother's Name</label>
                        <input name="mother" type="text" value={newnote.mother} required onChange={handleChange} placeholder="Please enter mother's name" />
                    </div>
                    <div className='popup_row1'>
                        <label>Father's Name</label>
                        <input name="father" type="text" value={newnote.father} required onChange={handleChange} placeholder="Please enter father's name" />
                    </div>
                    <div className='popup_row1'>
                        <label>Address</label>
                        <textarea name="address" rows={5} value={newnote.address} required onChange={handleChange} placeholder="Please enter address"></textarea>
                    </div>
                    <button type="submit" onClick={handleSubmit}>Edit</button>
                </form>
            </div>
        </>
    );
}