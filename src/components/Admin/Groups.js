import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Group.css';

export const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);  // Store users to add to a group
    const [selectedUsers, setSelectedUsers] = useState([]);  // Store selected users
    const [isModalOpen, setIsModalOpen] = useState(false);  // Modal to create a group
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);  // Modal to add users to a group
    const [groupName, setGroupName] = useState('');
    const [currentGroupId, setCurrentGroupId] = useState(null);  // State for storing current group ID

    // Fetch groups and users
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/fetchallgroups`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                });
                const json = await response.json();
                setGroups(json);
            } catch (error) {
                console.error('Error fetching groups:', error.message);
            }
        };

        const fetchUsers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/fetchalluser`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                });
                const json = await response.json();
                setUsers(json);
            } catch (error) {
                console.error('Error fetching users:', error.message);
            }
        };

        fetchGroups();
        fetchUsers();
    }, []);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setGroupName('');
    };

    const openUserModal = (groupId) => {
        setIsUserModalOpen(true);
        setSelectedUsers([]);  // Reset selected users
        setCurrentGroupId(groupId);  // Set the current group ID when opening the modal
    };

    const closeUserModal = () => setIsUserModalOpen(false);

    const handleGroupCreation = async () => {
        if (!groupName) {
            alert("Group name is required");
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/creategroup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ name: groupName }),
            });

            const json = await response.json();

            if (json) {
                setGroups((prevGroups) => [...prevGroups, json]);
                closeModal();
            }
        } catch (error) {
            console.error('Error creating group:', error.message);
        }
    };

    const handleUserSelection = (e, userId) => {
        if (e.target.checked) {
            setSelectedUsers([...selectedUsers, userId]);
        } else {
            setSelectedUsers(selectedUsers.filter(id => id !== userId));
        }
    };

    const handleAddUsersToGroup = async () => {
        if (selectedUsers.length === 0) {
            alert("Please select at least one user");
            return;
        }
        console.log(selectedUsers);
        
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/group/addusertogroup/${currentGroupId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': localStorage.getItem('token'),
                },
                body: JSON.stringify({ users: selectedUsers }),
            });

            const json = await response.json();

            if (json) {
                setGroups(groups.map(group =>
                    group._id === currentGroupId ? { ...group, users: json.users } : group
                ));
                closeUserModal();  // Close the user modal after successful addition
            }
        } catch (error) {
            console.error('Error adding users:', error.message);
        }
    };

    return (
        <div className="groups-page-container">
            <h2 className="groups-page-header">Group List</h2>
            <button className="create-group-btn" onClick={openModal}>Create Group</button>

            {groups.length === 0 ? (
                <p>No groups found.</p>
            ) : (
                <table className="groups-table">
                    <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Group Created At</th>
                            <th>Group Contacts</th>
                            <th>Add Users</th>  {/* New column to add users */}
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.date}</td>
                                <td>
                                    <button className='view-contact-btn' onClick={() => navigate(`/group/contact/${group._id}`)}>View Contacts</button>
                                </td>
                                <td>
                                    <button className='add-user-btn' onClick={() => openUserModal(group._id)}>Add User</button> {/* Add user button */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Modal for creating a group */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header">Create New Group</h3>
                        <input
                            className="modal-input"
                            type="text"
                            placeholder="Group Name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                        />
                        <button className="modal-action-btn" onClick={handleGroupCreation}>Create Group</button>
                        <button className="modal-cancel-btn" onClick={closeModal}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Modal for adding users to the group */}
            {isUserModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3 className="modal-header">Add Users to Group</h3>
                        {users.map((user) => (
                            <div key={user._id} className="user-item">
                                <input
                                    type="checkbox"
                                    id={`user-${user._id}`}
                                    onChange={(e) => handleUserSelection(e, user._id)}
                                />
                                <label htmlFor={`user-${user._id}`}>{user.name}</label>
                            </div>
                        ))}
                        <button className="modal-action-btn" onClick={handleAddUsersToGroup}>Add Users</button>
                        <button className="modal-cancel-btn" onClick={closeUserModal}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};
