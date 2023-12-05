import React from "react";
import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useNavigate } from "react-router-dom";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type ConversationType = {
  _id: string;
  members: UserType[];
  createdAt: number;
};

interface Conversation {
  conversation: ConversationType;
}

const MessageItem: React.FC<Conversation> = ({ conversation }) => {
  const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();

  const user = conversation.members.filter(
    (member) =>
      member._id !== (typeof loggedInUser == "object" && loggedInUser?.id)
  )[0];

  const { name, userName, profileImage, _id } = user;

  const handleUserClick = () => {
    try {
      _id && navigate(`/home/messages/${conversation._id}`);
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
      {/* <Modal
        open={isLoading}
        className="modal"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Modal> */}
    </li>
  );
};

export default MessageItem;
