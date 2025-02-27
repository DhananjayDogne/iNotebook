import React, { useEffect, useState } from 'react';
import { Notes } from "./Notes";
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem("role") === "admin") {
            console.log("admin");
            navigate("/admin/userlist");
        }
    }, []);

    return (
        <div>
            <header style={{ paddingTop: "4rem" }}>
                <h1>Welcome to the Home Page</h1>
                <Notes />
            </header>
        </div>
    );
}