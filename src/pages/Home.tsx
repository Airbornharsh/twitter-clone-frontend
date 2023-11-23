import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Widgets from "./Widgets/Widgets";
import "../App.css";
import auth from "../context/firebase";
import { Outlet } from "react-router-dom";

const Home = () => {
  const user = auth?.currentUser;
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="app">
      <Sidebar handleLogout={handleLogout} user={user} />
      <Outlet />
      <Widgets />
    </div>
  );
};

export default Home;
