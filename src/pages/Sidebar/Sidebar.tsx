import React, { useState } from "react";
import "./Sidebar.css";
import Twitter from "@mui/icons-material/Twitter";
import SidebarOptions from "./SidebarOptions";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DoneIcon from "@mui/icons-material/Done";
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
} from "@mui/material";
import CustomLink from "./CustomLink";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { User } from "firebase/auth";

interface Props {
  handleLogout: () => void;
  user: User | null;
}

const Sidebar: React.FC<Props> = ({ handleLogout, user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [loggedInUser] = useLoggedInUser();
  const openMenu = Boolean(anchorEl);

  const userProfilePic =
    (loggedInUser &&
      typeof loggedInUser === "object" &&
      loggedInUser?.profileImage &&
      loggedInUser?.profileImage) ||
    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png";

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  //  user?.email.split("@")[0];

  return (
    <div className="sidebar">
      <Twitter className="sidebar__twitterIcon" />
      <CustomLink to="/home/feed">
        <SidebarOptions active Icon={HomeIcon} text="Home" />
      </CustomLink>
      <CustomLink to="/home/explore">
        <SidebarOptions active Icon={SearchIcon} text="Explore" />
      </CustomLink>
      <CustomLink to="/home/notifications">
        <SidebarOptions active Icon={NotificationsIcon} text="Notifications" />
      </CustomLink>
      <CustomLink to="/home/messages">
        <SidebarOptions active Icon={MailOutlineIcon} text="Messages" />
      </CustomLink>
      <CustomLink to="/home/bookmarks">
        <SidebarOptions active Icon={BookmarkBorderIcon} text="Bookmarks" />
      </CustomLink>
      <CustomLink to="/home/lists">
        <SidebarOptions active Icon={ListAltIcon} text="Lists" />
      </CustomLink>
      <CustomLink to="/home/profile">
        <SidebarOptions active Icon={PermIdentityIcon} text="Profile" />
      </CustomLink>
      <CustomLink to="/home/more">
        <SidebarOptions active Icon={MoreHorizIcon} text="More" />
      </CustomLink>

      <Button variant="outlined" className="sidebar__tweet">
        Tweet
      </Button>

      <div className="Profile__info">
        <Avatar
          src={
            userProfilePic ||
            "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
          }
          alt="profile"
        />
        <div className="user__info">
          <h4>{loggedInUser.name ? loggedInUser.name : user?.displayName}</h4>
          {loggedInUser && typeof loggedInUser === "object" && (
            <h5>
              @
              {typeof loggedInUser == "object" && loggedInUser.userName
                ? loggedInUser.userName
                : user?.email?.split("@")[0]}
            </h5>
          )}
        </div>
        <IconButton
          size="small"
          sx={{ ml: 2 }}
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreHorizIcon />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClick={handleClose}
        >
          <MenuItem className="Profile__info">
            <Avatar src={userProfilePic} />
            <div className="user_info subUser__info">
              <div>
                <h4>
                  {" "}
                  {loggedInUser.name ? loggedInUser.name : user?.displayName}
                </h4>
                <h5>
                  @
                  {typeof loggedInUser == "object" && loggedInUser.userName
                    ? loggedInUser.userName
                    : user?.email?.split("@")[0]}
                </h5>
              </div>
              <ListItemIcon className="">
                <DoneIcon />
              </ListItemIcon>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleClose}>Add an existing account</MenuItem>
          <MenuItem onClick={handleLogout}>Log out @airbornharsh</MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Sidebar;
