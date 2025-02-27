import {useState} from 'react';
import NoteContext from './NoteContext';

const NoteState = (props) => { 
    const host = "http://localhost:5000";
    const notesInitial =[ ]
    
    const [notes, setNotes] = useState(notesInitial);
    //Add notes
    const addNotes = async (name, email, mobile, mother, father, address) => {
        
        const note = await fetch(`${host}/api/contacts/addcontact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ name, email, mobile, mother, father, address }),
        });
        
        setNotes(notes.concat(note));
     }

    //edit
    const editNote = async (id, name, email, mobile, mother, father, address) => {
        
        //Backend Api call
        const response = await fetch(`${host}/api/contacts/updatecontact/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token":localStorage.getItem('token')
            },
            body: JSON.stringify({ name, email, mobile, mother, father, address }), 
        });
        
        const newnotes = JSON.parse(JSON.stringify(notes));

        for (let i = 0; i < newnotes.length; i++) { 
            if (newnotes[i]._id === id) { 
                newnotes[i].name = name;
                newnotes[i].email = email;
                newnotes[i].mobile = mobile;
                newnotes[i].mother = mother;
                newnotes[i].father = father;
                newnotes[i].address = address;
                break;
            }
        }
        setNotes(newnotes)
        const json = await response.json();
    }

    //Delete notes
    const deleteNote = async (id) => {
        const response = await fetch(`${host}/api/contacts/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
        });
        
        
        const newNotes = notes.filter((note) => {return note._id !== id });
        setNotes(newNotes);
    }
    //Fetch All Contact
    const fetchNotes = async() => { 
        
        const response = await fetch(`${host}/api/contacts/fetchallcontact`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify(),
        });
        const json = await response.json();
        console.log(json);
        
        setNotes(json);
    }

   

   
    return (
        <NoteContext.Provider value={{ notes, addNotes, deleteNote, editNote, fetchNotes }}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;