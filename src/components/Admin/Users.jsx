import React, { useEffect, useState } from "react";
import './Users.css'; 
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [userlist, setUserlist] = useState([]);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/fetchalluser`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });

            const json = await response.json();
            // console.log(json);
            setUserlist(json);
        } catch (error) {
            console.error("Error fetching users:", error.message);
        }
    };
    
    const getUserDetails = (id) => {
        navigate(`/admin/contact/${id}`);
    }
   

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="user-container">
            <h2>User List</h2>
            {userlist.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userlist.map((user) => (
                            <tr key={user._id} onClick={()=>getUserDetails(user._id)}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{new Date(user.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};