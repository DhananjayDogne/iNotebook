import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Group.css';
export const Groups = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [groupName, setGroupName] = useState('');

    useEffect(() => {
        // Fetch groups from the API
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
                console.log(json);
                setGroups(json);
            } catch (error) {
                console.error('Error fetching groups:', error.message);
            }
        };

        fetchGroups();
    }, []);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setGroupName('');
    };

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
                body: JSON.stringify({
                    name: groupName
                }),
            });

            const json = await response.json();

            if (json) {
                // Update the group list after creating a group
                setGroups((prevGroups) => [...prevGroups, json]);
                closeModal(); // Close the modal after group creation
            }
        } catch (error) {
            console.error('Error creating group:', error.message);
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
                            <th>Group Craeted At</th>
                            <th>Group Contacts</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.date}</td>
                                <td><button onClick={() => navigate(`/group/contact/${group._id}`)}>View Contact</button></td>
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
        </div>
    );
};
