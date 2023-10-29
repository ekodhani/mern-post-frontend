import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import CreatePost from "./pages/CreatePost";
import DetailPost from "./pages/DetailPost";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthContext } from "./helper/AuthContext";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangesPassword";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  }); // diawal authState belum terautentikasi

  useEffect(() => {
    axios
      .get("http://localhost:8001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          }); // sudah terautentikasi
        }
      });
  }, []);

  // proses logout
  const LogoutProcess = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    // masih menggunakan refresh page
    window.location.href = '/login';
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              <Link to="/about">About</Link>
              {!authState.status ? (
                <>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home</Link>
                  <Link to="/createpost">Create Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h3>{authState.username}</h3>
              {authState.status && (
                <button onClick={LogoutProcess}>Logout</button>
              )}
            </div>
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/about" component={About} />
            <Route path="/createpost" component={CreatePost} />
            <Route path="/post/:id" component={DetailPost} />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
            <Route path="/profile/:id" component={Profile} />
            <Route path="/changepassword" component={ChangePassword} />
            <Route path="*" component={NotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
