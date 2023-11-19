import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import auth from "../firebase.init";
import { useNavigate } from "react-router-dom/dist";
import PageLoading from "./PageLoading";

const ProtectedRoute = ({ children }) => {
  const [user, isLoading] = useAuthState(auth);
  console.log("🚀 ~ file: ProtectedRoute.js:9 ~ ProtectedRoute ~ isLoading:", isLoading)
  const navigate = useNavigate();

  if (isLoading) {
    return <PageLoading />;
  }

  if (!user) {
    navigate("/login");
  } else {
    console.log(user);
  }

  return children;
};

export default ProtectedRoute;
