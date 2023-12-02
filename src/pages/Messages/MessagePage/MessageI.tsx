import React from "react";
import "../Messages.css";

interface MessageIProps {
  id: string;
  message: any;
  scroll?: React.RefObject<HTMLSpanElement>;
}

const MessageI: React.FC<MessageIProps> = ({ id, message, scroll }) => {
  scroll?.current?.scrollIntoView({ behavior: "smooth" });

  if (!id) {
    return null;
  }

  if (!Object.keys(message).includes("read")) {
    return (
      <li className="message__intro">
          <span>{message.message}</span>
          <span>{new Date(message.createdAt).toLocaleDateString()}</span>
      </li>
    );
  }

  if (message.sender.toString().trim() === id.toString().trim()) {
    return (
      <li className="message__container1" key={message._id}>
        <div className="message__child1">
          <p>{message.message}</p>
        </div>
      </li>
    );
  } else {
    return (
      <li className="message__container2" key={message._id}>
        <div className="message__child2">
          <p>{message.message}</p>
        </div>
      </li>
    );
  }
};

export default MessageI;
