import React from "react";
import Sidebar from "./Sidebar/Sidebar";
import Widgets from "./Widgets/Widgets";
import "../App.css";
import auth from "../context/firebase";
import { Outlet, useLocation } from "react-router-dom";
import NavBarTop from "./Home/NavBarTop";
import NavBarBottom from "./Home/NavBarBottom";

const Home = () => {
  const user = auth?.currentUser;
  const handleLogout = () => {
    auth.signOut();
  };

  const location = useLocation();

  return (
    <div className="app">
      {location.pathname.split("/")[5] !== "video" && (
        <Sidebar handleLogout={handleLogout} user={user} />
      )}
      {/* <NavBarTop /> */}
      <Outlet />
      <NavBarBottom />
      {location.pathname.split("/")[5] !== "video" && <Widgets />}
    </div>
  );
};

export default Home;
