import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './GroupContact.css';

const GroupContact = () => {
    const { id } = useParams();
    const [contacts, setContacts] = useState([]);
    const [popup, setPopup] = useState("popup");
    const [newContactPopup, setNewContactPopup] = useState("popup");
    const [currentContact, setCurrentContact] = useState(null);
    const [newContact, setNewContact] = useState({
        name: '',
        email: '',
        mobile: '',
        mother: '',
        father: '',
        address: '',
    });
    const navigate = useNavigate();
    const fetchContactDetails = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/contact/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const result = await response.json();
            console.log(result);
            if (response.status) {
                setContacts(result);
            } else {
                console.error('Error fetching contacts:', result.message);
            }
        } catch (error) {
            console.error('Error fetching contact details:', error.message);
        }
    };

    

    // Popup for editing a contact
    const popupEdit = (contact) => {
        setCurrentContact(contact);
        setPopup("popup poped");
    };

    // Close the edit popup
    const popupRemove = () => {
        setPopup("popup");
        setCurrentContact(null);
    };

    // Popup for creating a new contact
    const popupAddContact = () => {
        setNewContactPopup("popup poped");
    };

    // Close the add contact popup
    const popupRemoveAddContact = () => {
        setNewContactPopup("popup");
        setNewContact({
            name: '',
            email: '',
            mobile: '',
            mother: '',
            father: '',
            address: '',
        });
    };

    // Handle submit for editing an existing contact
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentContact) {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/contact/${currentContact._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                    body: JSON.stringify(currentContact),
                });
                const result = await response.json();
                if (response.ok) {
                    setContacts(contacts.map(contact =>
                        contact._id === currentContact._id ? currentContact : contact
                    ));
                    popupRemove();
                } else {
                    console.error('Error updating contact:', result.message);
                }
            } catch (error) {
                console.error('Error updating contact:', error.message);
            }
        }
    };

    // Handle changes in form input
    const handleChange = (e) => {
        if (currentContact) {
            setCurrentContact({ ...currentContact, [e.target.name]: e.target.value });
        } else {
            setNewContact({ ...newContact, [e.target.name]: e.target.value });
        }
    };

    // Handle delete action
    const handleDelete = async (contactId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/contact/${contactId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const result = await response.json();
            if (response.ok) {
                setContacts(contacts.filter(contact => contact._id !== contactId));
            } else {
                console.error('Error deleting contact:', result.message);
            }
        } catch (error) {
            console.error('Error deleting contact:', error.message);
        }
    };

    // Handle create new contact form submission
    const handleCreateContact = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/createcontact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ ...newContact, groupId: id }),
            });
            const result = await response.json();
            if (response.status) {
                setContacts([result, ...contacts]); 
                popupRemoveAddContact(); 
            } else {
                console.error('Error creating contact:', result.message);
            }
        } catch (error) {
            console.error('Error creating contact:', error.message);
        }
    };

    useEffect(() => {
        fetchContactDetails();
    }, []);

    return (
        <div className="contact-page-container">
            <h2>Contact Details</h2>
            <button className="add-contact-btn" onClick={popupAddContact}>Add New Contact</button>

            <div className="contact-list">
                {contacts.length > 0 ? (
                    contacts.map(contact => (
                        <div  className="contact-card" key={contact._id}>
                            <h3>{contact.name}</h3>
                            <p><strong>Email:</strong> {contact.email}</p>
                            <p><strong>Mobile:</strong> {contact.mobile}</p>
                            <p><strong>Mother:</strong> {contact.mother}</p>
                            <p><strong>Father:</strong> {contact.father}</p>
                            <p><strong>Address:</strong> {contact.address}</p>
                            <div className="icon-container">
                                <i className="fa-solid fa-trash-can trash" onClick={() => handleDelete(contact._id)}></i>
                                <i className="fa-regular fa-pen-to-square edit" onClick={() => popupEdit(contact)}></i>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='nocontactfound'>No contacts found in this group.</p>
                )}
            </div>

            {/* Edit Popup */}
            <div className={`${popup}`}>
                <div className="heading">
                    <h5>Edit Contact</h5>
                    <i className="fa-regular fa-circle-xmark" onClick={popupRemove}></i>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="popup_row1">
                        <label>Name</label>
                        <input
                            name="name"
                            type="text"
                            value={currentContact ? currentContact.name : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={currentContact ? currentContact.email : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Mobile</label>
                        <input
                            name="mobile"
                            type="text"
                            value={currentContact ? currentContact.mobile : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter mobile"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Mother's Name</label>
                        <input
                            name="mother"
                            type="text"
                            value={currentContact ? currentContact.mother : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter mother's name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Father's Name</label>
                        <input
                            name="father"
                            type="text"
                            value={currentContact ? currentContact.father : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter father's name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Address</label>
                        <textarea
                            name="address"
                            rows={5}
                            value={currentContact ? currentContact.address : ''}
                            onChange={handleChange}
                            required
                            placeholder="Enter address"
                        ></textarea>
                    </div>
                    <button type="submit">Save Changes</button>
                </form>
            </div>

            {/* Add Contact Popup */}
            <div className={`${newContactPopup}`}>
                <div className="heading">
                    <h5>Add New Contact</h5>
                    <i className="fa-regular fa-circle-xmark" onClick={popupRemoveAddContact}></i>
                </div>
                <form onSubmit={handleCreateContact}>
                    <div className="popup_row1">
                        <label>Name</label>
                        <input
                            name="name"
                            type="text"
                            value={newContact.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Email</label>
                        <input
                            name="email"
                            type="email"
                            value={newContact.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter email"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Mobile</label>
                        <input
                            name="mobile"
                            type="text"
                            value={newContact.mobile}
                            onChange={handleChange}
                            required
                            placeholder="Enter mobile"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Mother's Name</label>
                        <input
                            name="mother"
                            type="text"
                            value={newContact.mother}
                            onChange={handleChange}
                            required
                            placeholder="Enter mother's name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Father's Name</label>
                        <input
                            name="father"
                            type="text"
                            value={newContact.father}
                            onChange={handleChange}
                            required
                            placeholder="Enter father's name"
                        />
                    </div>
                    <div className="popup_row1">
                        <label>Address</label>
                        <textarea
                            name="address"
                            rows={5}
                            value={newContact.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter address"
                        ></textarea>
                    </div>
                    <button type="submit">Create Contact</button>
                </form>
            </div>

            <button onClick={() => navigate('/group')} className="back-btn">Back to Group</button>
        </div>
    );
};

export default GroupContact;
