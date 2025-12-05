import React from "react";
import "../../assets/css/Profile.css";
import TopHeader from "../layout/TopHeader.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const Profile = ({ user, onLogOut }) => {
    return (
        <div className="profile-container">
            <div className="profile-top-bar">
                <TopHeader user={user} onAdd={() => alert("Add new customer")} onLogOut={onLogOut}/>
            </div>

            <div className="profile-side-bar">
                <Sidebar user={user} onLogout={onLogOut} />
            </div>
        </div>
    );
};

export default Profile;
