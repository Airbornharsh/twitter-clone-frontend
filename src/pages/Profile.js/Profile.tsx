import React from "react";
import "../Page.css";
import { useUserAuth } from "../../context/UserAuthContext";
import MainProfile from "./MainPage/MainPage";

function Profile() {
  const { user } = useUserAuth();

  return (
    <div className="profilePage">
      <MainProfile user={user} />
    </div>
  );
}

export default Profile;
