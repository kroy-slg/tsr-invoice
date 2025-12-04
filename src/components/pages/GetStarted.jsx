import React from "react";
import GoogleAuth from "../services/auth/GoogleAuth.jsx";
import "../../assets/css/GetStarted.css";
import {useNavigate} from "react-router-dom";
import Footer from "../layout/Footer.jsx";

const GetStarted = ({user, onLogin, onLogout}) => {
    const navigate = useNavigate();
    /**
     *
     * @param userInfo
     * Method to handle login
     */
    const handleLogin = (userInfo) => {
        onLogin(userInfo);
        navigate("/profile");
    };

    /**
     *
     * @param userInfo
     * Method to handle logout
     */
    const handleLogout = ( userInfo ) => {
        onLogout(userInfo);
    };

    return (
        <div className="get-started-container">
            <main className="get-started-main">
                <div className="get-started-card">
                    {!user ? (
                        <>
                            <GoogleAuth user={user} onLogin={handleLogin} onLogout={onLogout} />
                        </>
                    ) : (
                        <>
                            <h2 className="get-started-title">
                                <strong>{user.name}</strong> 👋
                            </h2>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </main>
            {!user && <Footer />}
        </div>
    );
};

export default GetStarted;
