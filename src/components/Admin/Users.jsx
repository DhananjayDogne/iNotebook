import React, { useEffect, useState } from "react";
import './Users.css';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
            setUserlist(json);
        } catch (error) {
            toast.error(`Error fetching users:${error.message}`);
        }
    };

    const getUserDetails = (id) => {
        navigate(`/admin/contact/${id}`);
    };

    const editUser = (user) => {
        navigate(`/admin/edituser/${user._id}`, { state: { user } });
    };

    const deleteUser = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_HOSTURL}/api/admin/deleteuser/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token'),
                },
            });

            const newUsers = userlist.filter((user) => user._id !== id);
            setUserlist(newUsers);
        } catch (error) {
            console.error("Error Deleting user:", error.message);
        }
    };

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
                            <th>Contacts</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userlist.map((user) => (
                            <tr key={user._id} >
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{new Date(user.date).toLocaleDateString()}</td>
                                <td><button className='view-contact-btn' onClick={() => getUserDetails(user._id)}>View</button></td>
                                <td><i className="fa-regular fa-pen-to-square edit" onClick={() => editUser(user)}></i></td>
                                
                                <td><i className="fa-solid fa-trash-can trash" onClick={() => deleteUser(user._id)}></i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
