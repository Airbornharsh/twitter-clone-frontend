import React from "react";
import "../Page.css";
import { useUserAuth } from "../../context/UserAuthContext";
import MainProfile from "./MainPage/MainPage";
import OtherProfile from "./OtherProfile/OtherProfile";
import { useLocation } from "react-router-dom";

function Profile() {
  const { user } = useUserAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const email = params.get("email");

  return (
    <div className="profilePage">
      {!email ? <MainProfile user={user} /> : <OtherProfile email={email} />}
    </div>
  );
}

export default Profile;
