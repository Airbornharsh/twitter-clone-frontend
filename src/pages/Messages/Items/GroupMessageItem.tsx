import React from "react";
// import useLoggedInUser from "../../../hooks/useLoggedInUser";
import { useNavigate } from "react-router-dom";

type GroupConversationType = {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupImage: string;
  groupAdmin: string[];
  groupMembers: string[];
  requestedMembers: string[];
  createdAt: number;
};

interface Conversation {
  groupConversation: GroupConversationType;
}

const GroupMessageItem: React.FC<Conversation> = ({ groupConversation }) => {
  // const [loggedInUser] = useLoggedInUser();
  const navigate = useNavigate();

  const handleUserClick = () => {
    try {
      navigate(`/home/messages/group/${groupConversation._id}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <li className="userCard__container" onClick={handleUserClick}>
      <div className="userCard__child1">
        <img
          src={
            groupConversation.groupImage
              ? groupConversation.groupImage
              : "https://www.proactivechannel.com/Files/BrandImages/Default.jpg"
          }
          alt="profileImage"
        />
        <div className="userCard__details">
          <h4>{groupConversation.groupName}</h4>
          <p>{groupConversation.groupMembers.length} Members</p>
        </div>
      </div>
    </li>
  );
};

export default GroupMessageItem;
