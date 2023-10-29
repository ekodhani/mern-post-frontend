import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helper/AuthContext";
import { useHistory } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthState } = useContext(AuthContext);
  let history = useHistory();

  const LoginProcess = (e) => {
    e.preventDefault();
    const data = { username: username, password: password };
    axios.post("http://localhost:8001/auth/login", data).then((response) => {
      // cek apakah response.data berhasil dijalankan
      if (response.data.error) {
        alert(response.data.error);
      } else {
        console.log(response.data); // muncul data
        alert(response.data.message); // pesan muncul dalam bentuk alert
        // menyimpan token kedalam local storage (sessions, cookies, dll)
        localStorage.setItem("accessToken", response.data.accessToken);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        }); // terautentikasi
        // ketika sudah terautentikasi maka diarahkan ke halaman home
        history.push("/");
      }
    });
  };

  return (
    <form onSubmit={(e) => LoginProcess(e)}>
      <div className="loginContainer">
        <label>Username</label>
        <input
          type="text"
          autoComplete="off"
          name="username"
          placeholder="Enter username here"
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="password"
          autoComplete="off"
          name="password"
          placeholder="Enter password here"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <button type="submit">Login</button>
      </div>
    </form>
  );
}

export default Login;
