import { useNavigate } from "react-router-dom";
import "./UserCard.css";
import React from "react";
import { IconButton } from "@mui/material";
interface UserCardProps {
  profileImage: string;
  name: string;
  userName: string;
  email: string;
  id: string;
  type: string;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  name,
  userName,
  email,
  id,
  type,
}) => {
  const navigate = useNavigate();

  const handleUserClick = async () => {
    try {
      email && navigate(`/home/explore/${email}`);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAllowUser = async () => {
    try {
    } catch (e) {
      console.log(e);
    }
  };

  const handleDenyUser = async () => {
    try {
    } catch (e) {
      console.log(e);
    }
  };

  const handleBlockUser = async () => {
    try {
    } catch (e) {
      console.log(e);
    }
  };

  const handleUnblockUser = async () => {
    try {
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <li className="userCard__container" onClick={handleUserClick}>
      <div className="userCard__child1">
        <img
          src={
            profileImage
              ? profileImage
              : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
          }
          alt="profileImage"
        />
        <div className="userCard__details">
          <h4>{name}</h4>
          <p>@{userName}</p>
        </div>
      </div>
      {type === "pending" && (
        <div className="userCard__child2">
          <button onClick={handleAllowUser}>Allow</button>
          <button onClick={handleDenyUser}>Deny</button>
        </div>
      )}
      {type === "allowed" && (
        <div className="userCard__child2">
          <button onClick={handleBlockUser}>Block</button>
        </div>
      )}
      {type === "blocked" && (
        <div className="userCard__child2">
          <button onClick={handleUnblockUser}>Unblock</button>
        </div>
      )}
      {type === "" && (
        <IconButton className="userCard__follow">
          <p>+</p>
        </IconButton>
      )}
    </li>
  );
};

export default UserCard;
