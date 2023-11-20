import React from "react";
import twitter from "../../assets/images/twitter.png";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useSendEmailVerification,
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../firebase.init";
import { useState } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom/dist";
import "./Login.css";
import axios from "axios";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [error, setError] = useState("");

  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  if (user || googleUser) {
    navigate("/");
    console.log(user);
    console.log(googleUser);
  }

  error && console.log(error);
  loading && console.log(loading);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      await createUserWithEmailAndPassword(email, password);

      const user = {
        name: name,
        username: username,
        email: email,
      };

      await axios.post("http://localhost:4000/register", user);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img className="image" src={twitter} alt="" />
      </div>
      <div className="form-container">
        <div className="form-box">
          <TwitterIcon className="Twittericon" style={{ color: "skyblue" }} />
          <h2 className="heading">Happing now</h2>
          <h3 className="heading1">Join twitter today</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="username"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              className="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="email"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="btn-login">
              <button type="submit" className="btn">
                Sign up
              </button>
            </div>
          </form>
          <hr />
          <div className="google-button">
            <GoogleButton
              className="g-btn"
              type="light"
              onClick={handleGoogleSignIn}
            />
          </div>
          <div>
            Already have an account?{" "}
            <Link
              to={"/login"}
              style={{
                textDecoration: "none",
                color: "skyblue",
                fontWeight: "600",
                marginLeft: "5px",
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
