import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditUser.css';

export const EditUser = () => {
    const { state } = useLocation();  // get the user details passed from Users component
    const [user, setUser] = useState(state.user);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/updateuser/${user._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
                body: JSON.stringify(user),
            });

            const result = await response.json();
            if (response.ok) {
                navigate('/admin/userlist');
            } else {
                alert('Failed to update user');
            }
        } catch (error) {
            console.error("Error updating user:", error.message);
        }
    };

    return (
        <div className="edit-user-container">
            <h2>Edit User</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Role:
                    <input
                        type="text"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    );
};
