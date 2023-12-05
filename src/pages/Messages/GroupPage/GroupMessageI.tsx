import React from "react";
import "../Messages.css";

type UserType = {
  name: string;
  userName: string;
  profileImage: string;
  _id: string;
};

type GroupMessageType = {
  id: string;
  groupMessageId: string;
  groupMessage: string;
  groupMessageMedia: string[];
  sender: string;
  createdAt: number;
};

interface GroupMessageIProps {
  id: string;
  user: UserType;
  message: GroupMessageType;
  scroll?: React.RefObject<HTMLSpanElement>;
}

const GroupMessageI: React.FC<GroupMessageIProps> = ({
  id,
  user,
  message,
  scroll,
}) => {
  scroll?.current?.scrollIntoView({ behavior: "smooth" });

  console.log(message);

  if (!id) {
    return null;
  }

  if (!Object.keys(message).includes("readBy")) {
    return (
      <li className="message__intro">
        <span style={{
          fontWeight: "bold",
        }}>{new Date(message.createdAt).toLocaleDateString()}</span>
        <span>{message.groupMessage}</span>
      </li>
    );
  }

  if (message.sender.toString().trim() === id.toString().trim()) {
    return (
      <li className="message__container1" key={message.groupMessageId}>
        <div className="message__child1">
          <p>{message.groupMessage}bnjsnfjk</p>
        </div>
      </li>
    );
  } else {
    return (
      <li className="message__container2" key={message.groupMessageId}>
        <div className="message__child2">
          <p>{message.groupMessage}</p>
        </div>
      </li>
    );
  }
};

export default GroupMessageI;
