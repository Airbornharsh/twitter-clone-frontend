import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../context/firebase";
import { useState } from "react";
import GoogleButton from "react-google-button";
import { Link, useNavigate } from "react-router-dom/dist";
import "./Login.css";
import axios from "axios";
import { signOut } from "firebase/auth";
import { CircularProgress, Modal } from "@mui/material";
const twitter = require("../../assets/images/twitter.png");

const SignUp = () => {
  const [userName, setuserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");

  const navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  if (user || googleUser) {
    navigate("/");
  }

  error && console.log(error);
  loading && console.log(loading);
  googleError && console.log(googleError);
  googleLoading && console.log(googleLoading);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      await createUserWithEmailAndPassword(email, password);

      const user = {
        name: name,
        userName: userName,
        email: email,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user`, user);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const userData = (await signInWithGoogle())?.user;

      const user = {
        name: userData?.displayName,
        userName: userData?.email?.split("@")[0],
        email: userData?.email,
        profileImage: userData?.photoURL,
      };

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/user`, user);
    } catch (e) {
      console.log(e);
      signOut(auth);
    } finally {
      setIsLoading(true);
    }
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
              className="userName"
              placeholder="userName"
              onChange={(e) => setuserName(e.target.value)}
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
      <Modal
        open={isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Modal>
    </div>
  );
};

export default SignUp;
