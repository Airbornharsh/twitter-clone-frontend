import React from "react";
import SidebarOptions from "../Sidebar/SidebarOptions";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CustomLink from "../Sidebar/CustomLink";
import { useLocation } from "react-router-dom";

const NavBarBottom = () => {
  const location = useLocation();

  const activeEl = () => {
    if (
      location.pathname.split("/")[2] === "messages" &&
      location.pathname.split("/").length === 4
    ) {
      return true;
    }

    if (
      location.pathname.split("/")[2] === "messages" &&
      location.pathname.split("/")[3] === "group" &&
      location.pathname.split("/").length === 5
    ) {
      return true;
    }

    const pathLength = location.pathname.split("/").length;

    if (location.pathname.split("/")[pathLength - 1] === "video") {
      return true;
    }
  };

  if (!activeEl()) {
    return (
      <div className="navbarbottom__container">
        <CustomLink to="/home/feed">
          <SidebarOptions active Icon={HomeIcon} text="Home" />
        </CustomLink>
        <CustomLink to="/home/explore">
          <SidebarOptions active Icon={SearchIcon} text="Explore" />
        </CustomLink>
        <CustomLink to="/home/notifications">
          <SidebarOptions
            active
            Icon={NotificationsIcon}
            text="Notifications"
          />
        </CustomLink>
        <CustomLink to="/home/messages">
          <SidebarOptions active Icon={MailOutlineIcon} text="Messages" />
        </CustomLink>
      </div>
    );
  } else {
    return <></>;
  }
};

export default NavBarBottom;
