import React, { useState } from "react";
import axios from "axios";
function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    
    // change password
    const changePassword = () => {
        axios.put(
            "http://localhost:8001/auth/changepassword",
            {
                oldPassword: oldPassword,
                newPassword: newPassword,
            },
            {
                headers: {accessToken: localStorage.getItem("accessToken"),},
            }
        ).then((response) => {
            if (response.data.error) {
                alert(response.data.error);
            }
        });
    }

    return (
        <div className="profilePageContainer">
        <h1>Change Your Password</h1>
        <input id="inputEditPassword"
        type="text"
        placeholder="Old password..."
        onChange={(event) => {
        setOldPassword(event.target.value);
        }}
        />
        <input id="inputEditPassword"
        type="text"
        placeholder="New password..."
        onChange={(event) => {
        setNewPassword(event.target.value);
        }}
        />
        <button onClick={changePassword}> Save Changes</button>
        </div>
    );
}

export default ChangePassword;