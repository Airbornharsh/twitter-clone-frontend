import { Avatar } from "@mui/material";
import React from "react";
import TwitterIcon from "@mui/icons-material/Twitter";
import { IoIosSettings } from "react-icons/io";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { useNavigate } from "react-router-dom";

const NavBarTop = () => {
  const [loggedInUser] = useLoggedInUser();

  const profileSrc =
    typeof loggedInUser === "object"
      ? loggedInUser?.profileImage
      : "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const navigate = useNavigate();

  const toProfilePage = () => {
    navigate("/home/profile");
  };

  return (
    <div className="navbartop__container">
      <Avatar
        className="navbartop__avatar"
        alt="Profile PIC"
        onClick={toProfilePage}
        src={profileSrc}
      />
      <TwitterIcon
        className="navbartop__icon"
        fontSize="large"
        style={{
          color: "skyblue",
        }}
      />
      <IoIosSettings className="navbartop__setting" />
    </div>
  );
};

export default NavBarTop;
