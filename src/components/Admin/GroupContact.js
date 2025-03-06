import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './GroupContact.css';


const GroupContact = () => {
    const { id } = useParams();
    const [contacts, setContacts] = useState([]);
    const [popup, setPopup] = useState("popup");
    const [newContactPopup, setNewContactPopup] = useState("popup");
    const [currentContact, setCurrentContact] = useState(null);
    const [usersingroup, setUsersInGroup] = useState([]);
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
            // console.log(result);
            if (response.status) {
                setContacts(result);
                // toast.success('Successfully fetched contact details');
            } else {
                toast.error('Failed to fetch contact details');
            }
        } catch (error) {
            toast.error('Failed to fetch contact details');
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
                const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/editcontact/${currentContact._id}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                    body: JSON.stringify(currentContact),
                });
                const result = await response.json();
                if (response.status == 200 || response.status == 403) {
                    if (response.status == 403) {
                        toast.error('You do not have permission to edit contact');
                        popupRemove();
                    } else {
                        setContacts(contacts.map(contact =>
                            contact._id === currentContact._id ? currentContact : contact
                        ));
                        popupRemove();
                        fetchContactDetails();
                        toast.success('Contact updated successfully!');
                    }
                } else {
                    toast.error('Failed to update contact');
                }
            } catch (error) {
                toast.error('Error updating contact');
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
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/contact/${contactId}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
            });
            const result = await response.json();
            if (response.status == 200 || response.status == 403) {
                if (response.status == 403) {
                    toast.error('You do not have permission to delete contact');
                } else {
                    setContacts(contacts.filter(contact => contact._id !== contactId));
                    fetchContactDetails();
                    toast.success('Contact deleted successfully!');
                }
            } else {
                toast.error('Error deleting contact:');
            }
        } catch (error) {
            toast.error('Error deleting contact:');
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
            if (response.status==200) {
                setContacts([result, ...contacts]); 
                popupRemoveAddContact(); 
                fetchContactDetails();
                toast.success('Contact created successfully!');
            } else if (response.status == 403) {
                toast.error('You do not have permission to create contact');
                popupRemoveAddContact(); 
            } else {
                toast.error('Error creating contact:');
            }
        } catch (error) {
            console.error('Error creating contact:');
        }
    };

    const getalluserofgroup = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/getalluserofgroup/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                }
            });
            const result = await response.json();
            console.log(result);
            if (response) {
                setUsersInGroup(result);
                // toast.success('Contact created successfully!');
            } else {
                toast.error('Error geting User of Group');
            }
        } catch (error) {
            toast.error('Error geting User of Group');
        }
    };



    useEffect(() => {
        fetchContactDetails();
        getalluserofgroup();
    }, []);

    return (
        <div className='groupcontact'>
             <div className='usersingroup'>
                <h3>Users in this group:</h3>
                <l className='usersingroup_list'>
                    {usersingroup.length > 0 ? (
                        usersingroup.map(user => (
                            <ul key={user._id} className='useringroup_name'>
                                <p>{user.name}</p>

                            </ul>
                        ))
                    ) : (
                        <p>No users found in this group.</p>
                    )}

                </l>
            </div>
       
        <div className="contact-page-container">
           
            <h2>Contact Details</h2>
            <button className="add-grpcontact-btn" onClick={popupAddContact}> + Add New Contact</button>
            <div className='group'>
                
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
                    <button onClick={() => navigate('/group')} className="back-btn">Back to Group</button>
                </div>
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

            
        </div>
    );
};

export default GroupContact;
