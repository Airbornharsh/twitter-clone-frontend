import "./UserCard.css";
import React from "react";

interface UserCardProps {
  profileImage: string;
  name: string;
  userName: string;
  email: string;
}

const UserCard: React.FC<UserCardProps> = ({
  profileImage,
  name,
  userName,
  email,
}) => {
  return (
    <li className="userCard__container">
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
