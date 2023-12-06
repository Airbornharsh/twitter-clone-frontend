import React from "react";
import "../Page.css";
import MainProfile from "./MainPage/MainPage";
import useLoggedInUser from "../../hooks/useLoggedInUser";

function Profile() {
  const [loggedInUser] = useLoggedInUser();

  if (typeof loggedInUser !== "object") {
    return null;
  }
  
  return (
    <div className="profilePage">
      <MainProfile user={loggedInUser} />
    </div>
  );
}

export default Profile;
