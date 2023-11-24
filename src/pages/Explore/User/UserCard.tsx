import { useNavigate } from "react-router-dom";
import "./UserCard.css";
import React from "react";
import { CircularProgress, IconButton, Modal } from "@mui/material";
import axios from "axios";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
interface UserCardProps {
  profileImage: string;
  name: string;
  userName: string;
  email: string;
  id: string;
  type: string;
  removeUserFromList: (id: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  name,
  userName,
  email,
  id,
  type,
  removeUserFromList,
}) => {
  const [loggedInUser] = useLoggedInUser();
  const [isLoading, setIsLoading] = React.useState(false);
  const user = typeof loggedInUser == "object" ? loggedInUser : null;

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
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/allowing/${id}`,
        {},
        {
          headers: {
            email: user?.email,
          },
        }
      );
      removeUserFromList(id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyUser = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/blocking/${id}`,
        {},
        {
          headers: {
            email: user?.email,
          },
        }
      );
      removeUserFromList(id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/user/privacy/unblocking/${id}`,
        {},
        {
          headers: {
            email: user?.email,
          },
        }
      );
      removeUserFromList(id);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="userCard__container">
      <div className="userCard__child1" onClick={handleUserClick}>
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
          <button onClick={handleDenyUser}>Block</button>
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
      <Modal
        open={isLoading}
        className="modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Modal>
    </li>
  );
};

export default UserCard;
