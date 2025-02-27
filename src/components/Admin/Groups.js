import React, { useState, useEffect } from 'react';

export const Groups = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        // Fetch groups from the API (you can replace this with your own API endpoint)
        const fetchGroups = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/fetchallgroups`, {
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

        fetchGroups();
    }, []);

    return (
        <div className="group-container">
            <h2>Group List</h2>
            {groups.length === 0 ? (
                <p>No groups found.</p>
            ) : (
                <table className="group-table">
                    <thead>
                        <tr>
                            <th>Group Name</th>
                            <th>Group Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
                            <tr key={group._id}>
                                <td>{group.name}</td>
                                <td>{group.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
