import { useNavigate } from "react-router-dom";
import "./UserCard.css";
import React from "react";

interface UserCardProps {
  profileImage: string;
  name: string;
  userName: string;
  email: string;
  id: string;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  name,
  userName,
  email,
  id,
}) => {
  const navigate = useNavigate();

  const handleUserClick = async () => {
    try {
      email && navigate(`/home/explore/${email}`);
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
      <button>Follow</button>
    </li>
  );
};

export default UserCard;
