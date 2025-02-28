import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';  // You can create a separate CSS file for styling

export const AdminHome = () => {
    const navigate = useNavigate();

    const goToUserList = () => {
        navigate('/admin/users'); // Navigate to the user list page
    };

    const goToGroupList = () => {
        navigate('/admin/groups'); // Navigate to the group list page
    };

    return (
        <div className="admin-home-container">
            <h2>Admin Dashboard</h2>
            <div className="admin-options">
                <button className="admin-btn" onClick={goToUserList}>Go to User List</button>
                <button className="admin-btn" onClick={goToGroupList}>Go to Group List</button>
            </div>
        </div>
    );
};


