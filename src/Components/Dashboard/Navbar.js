import React, { useEffect, useState } from 'react';

const Navbar = () => {
    const [userName, setuserName] = useState("");
    const [userEmail, setuserEmail] = useState("");

    useEffect(() => {
        const storedUserName = localStorage.getItem('userName');
        const storedUserEmail = localStorage.getItem('userEmail');

        if (storedUserName) {
            setuserName(storedUserName);
            setuserEmail(storedUserEmail);
        }
    }, []);

    return (
        <div className="navbar">
            <div className="user-info">
                <h3>Welcome back, {userName || 'User'}!</h3>
                <p className="user-email">{userEmail ? `Email: ${userEmail}` : 'Email: N/A'}</p>
            </div>
        </div>
    );
};

export default Navbar;