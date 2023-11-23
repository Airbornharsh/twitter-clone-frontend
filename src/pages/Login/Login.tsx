import React, { useState } from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import auth from "../../context/firebase";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom/dist";
import GoogleButton from "react-google-button";
import { signOut } from "firebase/auth";
import axios from "axios";
import { CircularProgress, Modal } from "@mui/material";
const twitter = require("../../assets/images/twitter.png");

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

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
      await signInWithEmailAndPassword(email, password);
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
        username: userData?.email?.split("@")[0],
        email: userData?.email,
        profileImage: userData?.photoURL,
      };

      await axios.post(
        "https://twitter-clone-backend.harshkeshri.com/api/user",
        user
      );
    } catch (e) {
      console.log(e);
      signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img className="image" src={twitter} alt="" />
      </div>
      <div className="form-container">
        <TwitterIcon
          style={{
            color: "skyblue",
          }}
        />
        <h2 className="heading">Happing now</h2>
        <h3 className="heading1">What happening today</h3>
        <form onSubmit={handleSubmit}>
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
              Login
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
          Don't have an account?{" "}
          <Link
            to={"/signup"}
            style={{
              textDecoration: "none",
              color: "skyblue",
              fontWeight: "600",
              marginLeft: "5px",
            }}
          >
            Sign up
          </Link>
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
export default Login;
