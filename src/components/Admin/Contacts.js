import './Contact.css';
const { Noteitem } = require('../Noteitem');
const { useParams } = require("react-router-dom");
const { useEffect, useState } = require("react");

export const Contacts = () => {
    const { id } = useParams();
    const [notes, setNotes] = useState([]);

    const getUserContacts = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/fetchcontact/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });

            const json = await response.json();
            setNotes(json);
            // console.log(json);
        } catch (error) {
            console.error("Error fetching user details:", error.message);
        }
    }

    useEffect(() => {
        getUserContacts(id);
    }, []);

    return (
        <>
            {/* <div className='all_contacts'>
                <h1>Your Contacts : </h1>
                <Link to="/addnote" className="add-contact-button">
                    + Add a Contact
                </Link>
            </div> */}
            
            <div className='contact_container'>
                {notes.length === 0 && 'No notes to display. Please Add Some Notes ! '}
            {notes.map((note) => {
                return <Noteitem key={note._id} note={note} />
                        
            })}
            
            </div>
        </>
    )
}

