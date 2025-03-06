import { useState } from 'react';
import NoteContext from './NoteContext';
import { ToastContainer, toast } from 'react-toastify';

const NoteState = (props) => {
    const host = "http://localhost:5000";
    const notesInitial = [];

    const [notes, setNotes] = useState(notesInitial);

    // Add note
    const addNotes = async (name, email, mobile, mother, father, address) => {
        try {
            const note = await fetch(`${host}/api/contacts/addcontact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({ name, email, mobile, mother, father, address }),
            });

            const result = await note.json();

            if (result.status == 200) {
                setNotes(notes.concat(result));
                toast.success('Contact added successfully!');
            } else {
                toast.error(`Error: ${result.message || 'Failed to add contact'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Edit note
    const editNote = async (id, name, email, mobile, mother, father, address) => {
        try {
            const response = await fetch(`${host}/api/contacts/updatecontact/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
                body: JSON.stringify({ name, email, mobile, mother, father, address }),
            });

            const json = await response.json();

            if (response.status == 200) {
                const updatedNotes = notes.map((note) =>
                    note._id === id ? { ...note, name, email, mobile, mother, father, address } : note
                );
                setNotes(updatedNotes);
                toast.success('Contact updated successfully!');
            } else {
                toast.error(`Error: ${json.message || 'Failed to update contact'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Delete note
    const deleteNote = async (id) => {
        try {
            const response = await fetch(`${host}/api/contacts/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });

            const json = await response.json();

            if (response.status == 200) {
                setNotes(notes.filter((note) => note._id !== id));
                toast.success('Contact deleted successfully!');
            } else {
                toast.error(`Error: ${json.message || 'Failed to delete contact'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    // Fetch all notes
    const fetchNotes = async () => {
        try {
            const response = await fetch(`${host}/api/contacts/fetchallcontact`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
                },
            });

            const json = await response.json();

            if (response.status==200) {
                setNotes(json);
            } else {
                toast.error(`Error: ${json.message || 'Failed to fetch contacts'}`);
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <NoteContext.Provider value={{ notes, addNotes, deleteNote, editNote, fetchNotes }}>
            {props.children}
            {/* Toast Container for displaying toasts */}
            <ToastContainer />
        </NoteContext.Provider>
    );
};

export default NoteState;
