import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './EditUser.css';

export const EditUser = () => {
    const { state } = useLocation();
    const [user, setUser] = useState(state.user);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    // Handle form submission
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
                toast.success('User updated successfully');
            } else {
                toast.error('Failed to update user');
            }
        } catch (error) {
            toast.error('Failed to update user');
        }
    };

    return (
        <div className="edit-user-page-container">
            <h2 className="edit-user-page-header">Edit User</h2>
            <form className="edit-user-form" onSubmit={handleSubmit}>
                <label className="edit-user-form-label">
                    Name:
                    <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <label className="edit-user-form-label">
                    Email:
                    <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <label className="edit-user-form-label">
                    Role:
                    <input
                        type="text"
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        className="edit-user-form-input"
                    />
                </label>
                <button type="submit" className="edit-user-form-btn submit-btn">
                    Update
                </button>
            </form>
        </div>
    );
};
